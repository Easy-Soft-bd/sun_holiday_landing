"use client";

import React, { useState, useEffect } from 'react';
import { Button, Tag, Space, Descriptions, Card, Divider, Spin, message, Image } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function TourDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTourData(id as string);
    }
  }, [id]);

  const fetchTourData = async (tourId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      if (response.ok) {
        const data = await response.json();
        setTour(data);
      } else {
        message.error('Failed to fetch tour details');
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large"/></div>
  }

  if (!tour) {
    return <div text-center>Tour not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Space>
            <Link href="/portal/admin/dashboard/tours">
                <Button icon={<ArrowLeftOutlined />}>Back</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-0">{tour.title}</h1>
            <Tag color={tour.status === 'Active' ? 'green' : 'default'}>{tour.status}</Tag>
        </Space>
        
        <Link href={`/portal/admin/dashboard/tours/${id}/edit`}>
          <Button type="primary" icon={<EditOutlined />}>Edit Tour</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
              <Card title="Overview" className="shadow-sm">
                 <Descriptions bordered column={1}>
                    <Descriptions.Item label="Location">{tour.location}</Descriptions.Item>
                    <Descriptions.Item label="Duration">{tour.duration}</Descriptions.Item>
                    <Descriptions.Item label="Category">{tour.category}</Descriptions.Item>
                    <Descriptions.Item label="Price">৳{tour.price?.toLocaleString()}</Descriptions.Item>
                 </Descriptions>
                 <div className="mt-4">
                     <h3 className="font-semibold mb-2">Description</h3>
                     <p className="text-gray-600 whitespace-pre-wrap">{tour.description}</p>
                 </div>
              </Card>

              <Card title="Itinerary" className="shadow-sm">
                  <div className="space-y-4">
                    {(tour.itinerary || []).map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {item.day}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Includes" className="shadow-sm">
                      <ul className="list-disc pl-5 space-y-1">
                          {(tour.includes || []).map((item: string, index: number) => (
                              <li key={index} className="text-gray-700">{item}</li>
                          ))}
                      </ul>
                  </Card>
                   <Card title="Excludes" className="shadow-sm">
                      <ul className="list-disc pl-5 space-y-1 text-red-500">
                          {(tour.excludes || []).map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                          ))}
                      </ul>
                  </Card>
              </div>
          </div>

          <div className="space-y-6">
              <Card title="Main Image" className="shadow-sm">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    className="rounded-lg w-full object-cover"
                    style={{ maxHeight: 300 }}
                  />
              </Card>

              <Card title="Highlights" className="shadow-sm">
                  <ul className="list-disc pl-5 space-y-2">
                       {(tour.highlights || []).map((item: string, index: number) => (
                          <li key={index} className="text-gray-700">{item}</li>
                      ))}
                  </ul>
              </Card>
              
               {tour.videoUrl && (
                  <Card title="Video" className="shadow-sm">
                      <a href={tour.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">
                          {tour.videoUrl}
                      </a>
                  </Card>
               )}
          </div>
      </div>
    </div>
  );
}
