"use client";

import { Divider } from "antd";
import StringListField from "../StringListField";

export default function HighlightsIncludesSection() {
  return (
    <>
      <StringListField
        name="highlights"
        label="Highlights"
        placeholder="Highlight point"
        addButtonText="Add Highlight"
      />

      <Divider className="!my-8 !border-slate-200" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StringListField
          name="includes"
          label="Includes"
          placeholder="Included item"
          addButtonText="Add Include"
        />
        <StringListField
          name="excludes"
          label="Excludes"
          placeholder="Excluded item"
          addButtonText="Add Exclude"
        />
      </div>
    </>
  );
}
