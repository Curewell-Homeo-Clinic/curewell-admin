export default function CurewellLogo() {
  return (
    <div className="my-1 flex gap-1 items-center justify-center border-2 border-red-600">
      {/* left side */}
      <div className="flex flex-col items-center justify-center px-2">
        <p className="text-2xl">Cure</p>
        <p className="text-sm">Safe hai!</p>
      </div>
      {/* right side */}
      <div className="flex flex-col items-center bg-red-500 justify-center px-2">
        <p className="text-2xl text-white">Well</p>
        <p className="text-white text-sm">Sahi hai!</p>
      </div>
    </div>
  );
}
