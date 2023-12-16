import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebaseConfig";
import Header from "../components/Header";
import { get, off, onValue, push, ref, set } from "firebase/database";
import ChildrenList from "../components/ChildrenList";
import toast from "react-hot-toast";
import { FaPlus, FaPowerOff } from "react-icons/fa";
import ChildModal from "../components/ChildModal";
import ScanningModal from "../components/ScanningModal";

const MainPage = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [screenTime, setScreenTime] = useState(0);
  const [activeChild, setActiveChild] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function reset() {
      const scanningRef = ref(database, `scanning`);
      await set(scanningRef, false);
    }
    reset();

    if (!localStorage.getItem("token")) {
      toast.error("Log in first");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const childrenRef = ref(database, `Children`);
    onValue(childrenRef, (snapshot) => {
      const childrenData = snapshot.val();
      const childrenList = [];
      for (const id in childrenData) {
        childrenList.push({ id, ...childrenData[id] });
      }
      setChildren(childrenList);
    });
  }, [user]);

  const toggleModal = (child) => {
    if (child) {
      setActiveChild(child);
      setChildName(child.name);
      setScreenTime(child.screenTime);
    } else {
      setActiveChild(null);
      setChildName("");
      setScreenTime(0);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleAddChild = async () => {
    if (!childName || !user) {
      toast.error("Pick a name first");
      return;
    }

    setIsScanning(true);

    try {
      const scanningRef = ref(database, `scanning`);
      await set(scanningRef, true);

      onValue(scanningRef, async (snapshot) => {
        const isScanningDB = snapshot.val();
        if (!isScanningDB) {
          const newKidRef = ref(database, `newKid`);

          try {
            const newKidSnapshot = await get(newKidRef);
            const newKidValue = newKidSnapshot.val();

            if (newKidValue !== null) {
              const childRef = ref(database, `Children/${newKidValue}`);
              await set(childRef, {
                name: childName,
                screenTime: screenTime,
                parent: user.id,
              });

              toast.success("Child added successfully");
              await set(newKidRef, null);
              setIsScanning(false);
              off(scanningRef);
            } else {
              console.log(
                "El valor de newKid en la base de datos es nulo o no existe."
              );
              setIsScanning(false);
              off(scanningRef);
            }
          } catch (error) {
            console.error(
              "Error al obtener el valor de newKid desde la base de datos:",
              error
            );
            setIsScanning(false);
          }
        }
      });
    } catch (error) {
      console.error("Error al agregar niño: ", error);
      setIsScanning(false);
    }
  };

  const handleUpdateChild = async () => {
    if (!childName || !user || !activeChild) {
      toast.error("Pick a name first");
      return;
    }
    try {
      const childRef = ref(
        database,
        `Children/${activeChild.id}`
      );
      await set(childRef, {
        ...activeChild,
        name: childName,
        screenTime: screenTime,
      });

      setActiveChild(null);
      setScreenTime(0);
      setChildName("");
    } catch (error) {
      console.error("Error al actualizar niño: ", error);
    }
  };

  const handleCancelScan = async () => {
    try {
      // Update the scanning status in Firebase
      const scanningRef = ref(database, `scanning`);
      const newKidRef = ref(database, `newKid`);
      await set(newKidRef, null);
      await set(scanningRef, false);

      // Update local state to reflect the cancellation and set the cancellation flag
      setIsScanning(false);

      // Provide feedback to the user
      toast.error("Scanning cancelled");
    } catch (error) {
      console.error("Error cancelling scan: ", error);
      toast.error("Error cancelling scan");
    }
  };

  const toggleLed = async () => {
    console.log("Turning LED");
    try {
      const ledRef = ref(database, `isLedOn`);
      const ledSnapshot = await get(ledRef);
      const ledValue = ledSnapshot.val();
      const isLedOn = ledValue;
      await set(ledRef, !ledValue);
      if (isLedOn) {
        const parentToggleRef = ref(database, `parentToggle`);
        await set(parentToggleRef, true);
      }
    } catch (error) {
      console.error("Error turning LED: ", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4">
        <ChildrenList
          children={children.filter((child) => child.parent === user.id)}
          toggleModal={toggleModal}
          setChildName={setChildName}
        />
        <button
          className="flex justify-center items-center h-16 w-16 fixed bottom-5 right-5 aspect-square rounded-full text-4xl font-bold text-white bg-primary hover:bg-primary-hover"
          onClick={() => {
            setActiveChild(null);
            toggleModal();
          }}
        >
          <FaPlus className="h-8 w-8" />
        </button>
        <button
          className="flex justify-center items-center h-16 w-16 fixed bottom-5 left-5 aspect-square rounded-full text-4xl font-bold text-white bg-red-500 hover:bg-red-600r"
          onClick={toggleLed}
        >
          <FaPowerOff className="h-8 w-8" />
        </button>
        <ChildModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          activeChild={activeChild}
          childName={childName}
          screenTime={screenTime}
          setScreenTime={setScreenTime}
          setChildName={setChildName}
          handleSave={activeChild ? handleUpdateChild : handleAddChild}
          user={user}
        />
        {isScanning && <ScanningModal handleCancelScan={handleCancelScan} />}
      </div>
    </div>
  );
};

export default MainPage;
