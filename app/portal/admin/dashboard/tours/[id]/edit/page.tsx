"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Space, message, Card, Divider, Spin, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function EditTourPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTourData(id as string);
    }
  }, [id]);

  const fetchTourData = async (tourId: string) => {
    setFetching(true);
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = {
            ...data,
        }
        form.setFieldsValue(formattedData);
      } else {
        message.error('Failed to fetch tour data');
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      message.error('An error occurred');
    } finally {
      setFetching(false);
    }
  };


  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Format date
      const formattedValues = {
        ...values,
         // Ensure arrays are handled correctly if empty
        highlights: values.highlights || [],
        includes: values.includes || [],
        excludes: values.excludes || [],
        gallery: values.gallery || [], 
        itinerary: values.itinerary || [],
      };

      const response = await fetch(`/api/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        message.success('Tour updated successfully');
        router.push('/portal/admin/dashboard/tours');
      } else {
        message.error('Failed to update tour');
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return <div className="flex justify-center items-center h-64"><Spin size="large"/></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Tour</h1>
        <Link href="/portal/admin/dashboard/tours">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Card title="Basic Information" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Tour Title"
              rules={[{ required: true, message: 'Please enter tour title' }]}
            >
              <Input placeholder="e.g. Cox's Bazar Beach Paradise" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input placeholder="e.g. Cox's Bazar, Bangladesh" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select>
                <Option value="International">International</Option>
                <Option value="Domestic">Domestic</Option>
                <Option value="Hajj & Umrah">Hajj & Umrah</Option>
              </Select>
            </Form.Item>

             <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select>
                <Option value="Draft">Draft</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (BDT)"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value!.replace(/\৳\s?|(,*)/g, '')) as any}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please enter duration' }]}
            >
              <Input placeholder="e.g. 3 Days / 2 Nights" />
            </Form.Item>


          </div>
        </Card>

        <Card title="Media & Description" className="shadow-sm mt-6">
            <Form.Item
                label="Main Image"
                required
                help="Upload an image or provide a URL"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Upload
                        maxCount={1}
                        listType="picture-card"
                        beforeUpload={async (file) => {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            try {
                                const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData,
                                });
                                
                                if (response.ok) {
                                    const data = await response.json();
                                    form.setFieldsValue({ image: data.url });
                                    message.success('Image uploaded successfully');
                                } else {
                                    message.error('Failed to upload image');
                                }
                            } catch (error) {
                                message.error('Error uploading image');
                            }
                            
                            return false;
                        }}
                    >
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                    <Form.Item
                        name="image"
                        rules={[{ required: true, message: 'Please upload or enter image URL' }]}
                        noStyle
                    >
                        <Input placeholder="Or paste image URL here" />
                    </Form.Item>
                </Space>
            </Form.Item>
             <Form.Item
                name="videoUrl"
                label="Video URL (Optional)"
            >
                <Input placeholder="https://youtube.com/..." />
            </Form.Item>
             <Form.Item
                name="inquiryPhone"
                label="Inquiry Phone (Optional)"
                help="Phone number solely for this tour inquiries"
            >
                <Input placeholder="+880..." />
            </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Detailed description of the tour..." />
          </Form.Item>
        </Card>

        <Card title="Image Gallery" className="shadow-sm mt-6">
             <Upload
                multiple
                listType="picture-card"
                beforeUpload={async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            const currentGallery = form.getFieldValue('gallery') || [];
                            form.setFieldsValue({ gallery: [...currentGallery, data.url] });
                            message.success('Image uploaded successfully');
                        } else {
                            message.error('Failed to upload image');
                        }
                    } catch (error) {
                        message.error('Error uploading image');
                    }
                    
                    return false;
                }}
            >
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload Gallery Images</div>
                </div>
            </Upload>
            
             <Form.List name="gallery">
                {(fields, { add, remove }) => (
                <>
                     <Form.Item label="Gallery Image URLs" className="mt-4">
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name]}
                            rules={[{ required: true, message: 'Missing image URL' }]}
                        >
                            <Input placeholder="Image URL" style={{ width: 400 }}/>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add URL Manually
                        </Button>
                    </Form.Item>
                     </Form.Item>
                </>
                )}
            </Form.List>
        </Card>

        <Card title="Highlights & inclusions" className="shadow-sm mt-6">
             <Form.List name="highlights">
                {(fields, { add, remove }) => (
                <>
                     <Form.Item label="Highlights">
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name]}
                            rules={[{ required: true, message: 'Missing highlight' }]}
                        >
                            <Input placeholder="Highlight point" style={{ width: 400 }}/>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Highlight
                        </Button>
                    </Form.Item>
                     </Form.Item>
                </>
                )}
            </Form.List>

             <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Form.List name="includes">
                    {(fields, { add, remove }) => (
                    <>
                        <Form.Item label="Includes">
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name]}
                                rules={[{ required: true, message: 'Missing item' }]}
                            >
                                <Input placeholder="Included item" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Include
                            </Button>
                        </Form.Item>
                        </Form.Item>
                    </>
                    )}
                </Form.List>

                 <Form.List name="excludes">
                    {(fields, { add, remove }) => (
                    <>
                        <Form.Item label="Excludes">
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name]}
                                rules={[{ required: true, message: 'Missing item' }]}
                            >
                                <Input placeholder="Excluded item" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Exclude
                            </Button>
                        </Form.Item>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
            </div>
        </Card>

        <Card title="Itinerary" className="shadow-sm mt-6">
             <Form.List name="itinerary">
                {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex gap-4 mb-4 border-b pb-4 last:border-b-0">
                         <Form.Item
                            {...restField}
                            name={[name, 'day']}
                            label="Day"
                            rules={[{ required: true, message: 'Missing day' }]}
                        >
                            <InputNumber min={1} />
                        </Form.Item>
                         <div className="flex-1">
                             <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                label="Title"
                                rules={[{ required: true, message: 'Missing title' }]}
                            >
                                <Input placeholder="Day Title" />
                            </Form.Item>
                             <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                label="Description"
                                rules={[{ required: true, message: 'Missing description' }]}
                            >
                                <TextArea placeholder="Day Description" rows={2} />
                            </Form.Item>
                         </div>


                        <MinusCircleOutlined onClick={() => remove(name)} className="mt-8" />
                    </div>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Itinerary Day
                        </Button>
                    </Form.Item>
                </>
                )}
            </Form.List>
        </Card>

        <div className="flex justify-end mt-6">
            <Space>
                <Link href="/portal/admin/dashboard/tours">
                    <Button>Cancel</Button>
                </Link>
                <Button type="primary" htmlType="submit" loading={loading} size="large">
                    Update Tour
                </Button>
            </Space>
        </div>
      </Form>
    </div>
  );
}
