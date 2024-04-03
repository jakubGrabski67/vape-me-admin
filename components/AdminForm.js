import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function AdminForm({
  _id,
  name: existingName,
  surname: existingSurname,
  email: existingEmail,
  profilePicture: existingProfilePicture,
}) {
  const [name, setName] = useState(existingName || "");
  const [surname, setSurname] = useState(existingSurname || "");
  const [email, setEmail] = useState(existingEmail || "");
  const [profilePicture, setProfilePicture] = useState(
    existingProfilePicture || []
  );
  const [goToAdmins, setGoToAdmins] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/admins").then((result) => {
      setAdmins(result.data);
    });
  }, []);

  async function saveOrder(ev) {
    ev.preventDefault();
    const data = {
      name,
      surname,
      email,
      profilePicture,
    };
    if (_id) {
      //edit an existing admin
      await axios.put("/api/admins", { ...data, _id });
    } else {
      //create a new admin
      await axios.post("/api/admins", data);
    }
    setGoToAdmins(true);
  }
  if (goToAdmins) {
    router.push("/admins");
  }

  async function uploadProfilePicture(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setProfilePicture((oldProfilePicture) => {
        return [...oldProfilePicture, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateProfilePictureOrder(profilePicture) {
    setProfilePicture(profilePicture);
  }

  return (
    <form onSubmit={saveOrder}>
      <label>Imię pracownika</label>
      <input
        type="text"
        placeholder="Wprowadź imię pracownika..."
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label>Zdjęcie profilowe</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {!!profilePicture?.length &&
          profilePicture.map((link) => (
            <div
              key={link}
              className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
            >
              <img src={link} alt="" className="rounded-lg"></img>
            </div>
          ))}
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Dodaj zdjęcie</div>
          <input
            type="file"
            onChange={uploadProfilePicture}
            className="hidden"
          ></input>
        </label>
      </div>
      <label>Nazwisko pracownika</label>
      <textarea
        placeholder="Wprowadź nazwisko pracownika..."
        value={surname}
        onChange={(ev) => setSurname(ev.target.value)}
      />
      <label>Adres email Google pracownika</label>
      <input
        type="email"
        placeholder="Wprowadź adres email Google pracownika..."
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Zapisz
      </button>
    </form>
  );
}
