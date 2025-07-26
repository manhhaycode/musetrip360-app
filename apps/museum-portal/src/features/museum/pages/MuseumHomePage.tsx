import React from 'react';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);
const MuseumHomePage = () => {
  return (
    <div className="flex flex-1">
      {/* <RichEditor showToolbar placeholder="Nhập nội dung..." /> */}
      {/* <ScrollArea style={{ flex: '1 0 0' }} className="border rounded-lg relative px-2 min-h-0">
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </ScrollArea> */}
      <React.Suspense fallback={<div>Loading editor...</div>}>
        <RichEditor showToolbar placeholder="Nhập nội dung..." />
      </React.Suspense>
    </div>
  );
};

export default MuseumHomePage;
