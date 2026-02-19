export default function BeamsBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] 
        bg-gradient-to-br from-purple-300 via-blue-500 to-pink-500 
        opacity-30 blur-[160px] rounded-full animate-blob" />

      <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] 
        bg-gradient-to-br from-cyan-200 via-green-300 to-purple-700 
        opacity-30 blur-[160px] rounded-full animate-blob delay-2000" />
    </div>
  );
}
