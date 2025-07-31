import { useGetMuseumById, useMuseumStore, useUpdateMuseum } from '@musetrip360/museum-management';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BulkUploadProvider, MultipleUploadExample } from '@musetrip360/shared';
import React from 'react';
const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);
const MuseumHomePage = () => {
  const { selectedMuseum } = useMuseumStore();
  const { data: museum, refetch } = useGetMuseumById(selectedMuseum?.id ?? '', {
    enabled: !!selectedMuseum?.id,
  });
  const updateMuseum = useUpdateMuseum({
    onSettled: () => {
      refetch();
    },
  });
  if (!selectedMuseum) {
    return <div className="w-full justify-center">Vui lòng chọn bảo tàng để tiếp tục</div>;
  }

  if (!museum) {
    return <div className="w-full justify-center">Đang tải thông tin bảo tàng...</div>;
  }

  return (
    <React.Suspense fallback={<div className="w-full justify-center">Đang tải trình soạn thảo...</div>}>
      <RichEditor
        value={museum.metadata?.contentHomePage ?? ''}
        onSave={(content) => {
          updateMuseum.mutate({
            ...museum,
            metadata: {
              ...museum?.metadata,
              contentHomePage: content,
            },
          });
        }}
        toolbarConfig={{ showFontFamily: false }}
        showToolbar
        placeholder="Nhập nội dung..."
      />
      {/* <BulkUploadProvider>
        <MultipleUploadExample />
      </BulkUploadProvider> */}
    </React.Suspense>
  );
};

export default MuseumHomePage;
