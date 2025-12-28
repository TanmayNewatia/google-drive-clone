import Image from "next/image";

export const LogoWrapper = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png"
        alt="Drive Logo"
        width={32}
        height={32}
      />
      <p className="m-0 text-xl text-gray-400">Drive</p>
    </div>
  );
};
