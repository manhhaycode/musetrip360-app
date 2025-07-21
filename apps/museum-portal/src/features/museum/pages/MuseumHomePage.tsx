import { RichEditor } from '@musetrip360/rich-editor';
const MuseumHomePage = () => {
  return (
    <div className="flex flex-1">
      <RichEditor showToolbar placeholder="Nhập nội dung..." />
    </div>
  );
};

export default MuseumHomePage;
