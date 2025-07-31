export default function Error() {
  return (
    <div className="grid h-screen px-4 bg-background place-content-center">
      <div className="text-center">
        <h1 className="font-black text-muted text-9xl">404</h1>

        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">Not Found!</p>

        <p className="mt-4 text-muted-foreground">Trang bạn truy cập hiện tại không khả dụng</p>

        <button
          type="button"
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-primary-foreground bg-primary rounded hover:bg-primary/90 focus:outline-none focus:ring"
        >
          <a className="w-full h-full text-inherit" href="/">
            Trở lại trang chủ
          </a>
        </button>
      </div>
    </div>
  );
}
