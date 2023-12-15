import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { getHoursAndMinutes } from "../utils/utils";

import { ref, remove, set } from "firebase/database";
import { database } from "../config/firebaseConfig";

const ChildModal = ({
  toggleModal,
  isModalOpen,
  childName = "",
  setChildName,
  setScreenTime,
  screenTime = 0,
  handleSave,
  activeChild,
  user,
}) => {
  const handleDeleteChild = async () => {
    if (!activeChild || !user) {
      return;
    }

    try {
      const childRef = ref(
        database,
        `Users/${user.uid}/children/${activeChild.id}`
      );
      await remove(childRef);
      toggleModal(null); // Cierra el modal después de eliminar.
    } catch (error) {
      console.error("Error al eliminar niño: ", error);
    }
  };
  

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 p-10 place-items-center ${
        isModalOpen ? "grid" : "hidden"
      }`}
      onClick={() => toggleModal(null)}
    >
      <div
        className="flex flex-col relative gap-5 p-5 pt-10 w-full h-full rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <ImCross
          className="absolute top-3 right-3"
          onClick={() => toggleModal(null)}
        />
        <h1 className="text-center text-primary-dark text-2xl font-bold">
          Gestionar Niño
        </h1>
        <input
          type="text"
          value={childName || ""}
          onChange={(e) => {
            setChildName(e.target.value);
          }}
          placeholder="Nombre del Niño"
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex w-full px-5 justify-center items-center gap-5">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded text-white bg-primary hover:bg-primary-hover"
              onClick={() =>
                screenTime - 300000 > 0
                  ? setScreenTime(screenTime - 300000)
                  : setScreenTime(0)
              }
            >
              <FaMinus />
            </button>
            <span>{getHoursAndMinutes(screenTime).hours}hs</span>
            <span>{getHoursAndMinutes(screenTime).minutes}min</span>
            <button
              className="px-3 py-1 rounded text-white bg-primary hover:bg-primary-hover"
              onClick={() => setScreenTime(screenTime + 300000)}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {activeChild && (
          <button
            className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600"
            onClick={handleDeleteChild}
          >
            Eliminar Niño
          </button>
        )}

        <button
          className="px-3 py-1 rounded text-white bg-primary hover:bg-primary-hover"
          onClick={() => {
            toggleModal(null);
            handleSave();
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ChildModal;
