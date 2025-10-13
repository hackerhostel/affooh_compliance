import React, { useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import FormSelect from "../../components/FormSelect.jsx";

const AssetManagementHeader = () => {
  const [formValues, setFormValues] = useState({
    documentName: "",
    author: "",
    version: "",
    owner: "",
  });

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-12 flex-wrap">
          {/* Document Name */}
          <div className="w-64">
            <label className="text-sm font-medium">Document Name</label>
            <FormInput
              name="documentName"
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, documentName: e.target.value })
              }
            />
          </div>

          {/* Author */}
          <div className="w-64">
            <label className="text-sm font-medium">Author</label>
            <FormInput
              name="author"
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, author: e.target.value })
              }
            />
          </div>

          {/* Version */}
          <div className="w-64">
            <label className="text-sm font-medium">Version</label>
            <FormSelect
              name="version"
              options={[]}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, version: e.target.value })
              }
            />
          </div>

          {/* Owner */}
          <div className="w-64">
            <label className="text-sm font-medium">Owner</label>
            <FormSelect
              name="owner"
              options={[]}
              formValues={formValues}
              onChange={(e) =>
                setFormValues({ ...formValues, owner: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManagementHeader;
