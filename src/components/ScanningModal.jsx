import React from "react";

const ScanningModal = ({ handleCancelScan }) => {
  return (
    <div className="fixed grid place-items-center top-0 left-0 w-full h-full bg-white">
      <div className="relative w-full h-full">
        <button
          onClick={handleCancelScan}
          className="absolute z-40 top-5 right-5 bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md text-white"
        >
          Cancel
        </button>
        <h1 className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-10 text-2xl font-bold">
          Escaneando...
        </h1>

        <dotlottie-player
          src="https://lottie.host/f10ee65a-4ef1-4718-8724-a4eefd0743ee/ekhm8cQCZz.json"
          background="transparent"
          speed="1"
          loop
          autoplay
        ></dotlottie-player>
      </div>
    </div>
  );
};

export default ScanningModal;
