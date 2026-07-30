"use client";

import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Divider, Form, Input, Modal, Select } from "antd";
import { useCallback, useEffect, useState } from "react";

export type LocationOption = {
  id: number;
  name: string;
};

export default function LocationSelectField() {
  const { message } = App.useApp();
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/locations", { credentials: "same-origin" });
      if (!res.ok) {
        message.error("Could not load locations");
        return;
      }
      const data = (await res.json()) as unknown;
      setOptions(Array.isArray(data) ? (data as LocationOption[]) : []);
    } catch {
      message.error("Could not load locations");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    void load();
  }, [load]);

  const createLocation = async () => {
    const name = newName.trim();
    if (!name) {
      message.warning("Enter a location name");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        message.error("Could not create location");
        return;
      }
      const row = (await res.json()) as LocationOption;
      await load();
      form.setFieldValue("locationId", row.id);
      setModalOpen(false);
      setNewName("");
      message.success("Location saved");
    } catch {
      message.error("Could not create location");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Form.Item
        name="locationId"
        label="Location"
        rules={[{ required: true, message: "Select a location or add a new one" }]}
      >
        <Select
          size="large"
          className="!rounded-lg"
          showSearch
          loading={loading}
          placeholder="Search or select location"
          optionFilterProp="label"
          options={options.map((o) => ({ value: o.id, label: o.name }))}
          popupRender={(menu) => (
            <>
              {menu}
              <Divider className="my-1 border-slate-100" />
              <Button
                type="link"
                className="w-full justify-start text-left"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
              >
                Add new location
              </Button>
            </>
          )}
        />
      </Form.Item>

      <Modal
        title="Add location"
        open={modalOpen}
        okText="Save"
        onOk={() => void createLocation()}
        confirmLoading={creating}
        onCancel={() => {
          setModalOpen(false);
          setNewName("");
        }}
        destroyOnHidden
      >
        <p className="mb-3 text-sm text-slate-600">
          This will be saved to the database and can be reused on other tours.
        </p>
        <Input
          size="large"
          placeholder="e.g. Cox's Bazar, Bangladesh"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onPressEnter={() => void createLocation()}
        />
      </Modal>
    </>
  );
}
