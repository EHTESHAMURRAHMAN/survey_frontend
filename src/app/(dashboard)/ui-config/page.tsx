import { getUIConfig } from "@/lib/getUIConfig";

import UIConfigForm from "./UIConfigForm";

export default async function AdminUIConfigPage() {
  const page = "survey";
  const config = await getUIConfig(page);

  return (
    <div className="p-2  mx-auto">
      <UIConfigForm page={page} initialConfig={config} />
    </div>
  );
}
