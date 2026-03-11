import { useState, useEffect } from "react";
import type { Contact, Errors } from "./types";
import ContactRow from "./components/ContactRow";
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const dataFromLocalStorage = localStorage.getItem("contacts");
    return dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : [];
  })
  const [editingContact, setEditingContact] = useState(0);


  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search])

  useEffect(() => {
    if (!debouncedSearch) return;
  }, [debouncedSearch])

  const addContact = () => {
    const errors = validateForm();

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const newContact = {
      id: Date.now(),
      name,
      countryCode,
      phone
    }

    setContacts([...contacts, newContact]);

    clearForm();
  }

  const validateForm = (): Errors => {
    const errors: Errors = {};

    if (!name.trim()) errors.name = "El nombre es obligatorio";
    if (!countryCode.trim()) errors.countryCode = "El código país es obligatorio";
    if (!phone.trim()) errors.phone = "El teléfono es obligatoriio";
    else if (!/^\d+$/.test(phone)) errors.phone = "El teléfono debe contener solo números";
    else if (phone.length !== 10) errors.phone = "El teléfono debe contener 10 caracteres";

    return errors;
  }


  const contactsFiltered = contacts.filter((contact) => contact.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  }


  const editContact = (id: number) => {
    setErrors({});

    const contactEdit = contacts.find((contact) => contact.id === id);

    if (!contactEdit) return;

    setName(contactEdit.name);
    setCountryCode(contactEdit.countryCode);
    setPhone(contactEdit.phone);

    setEditingContact(contactEdit.id);
  }

  const updateContact = () => {
    const errors = validateForm();

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setContacts(contacts.map((contact) => contact.id === editingContact ? { ...contact, name, countryCode, phone } : contact));
    setEditingContact(0);

    clearForm();
  }


  const clearForm = () => {
    setName("");
    setCountryCode("");
    setPhone("");
  }


  return (
    <>
      <div className="app-container">
        <div className="add-contact">
          <h1 className="title-app">Phone Book</h1>
          <div className="content-data-contact">
            <div className="content-search">
              <label htmlFor="">Buscar</label>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar contacto..." />
            </div>
            <div className="form-content">
              <div className="singular-data">
                <label htmlFor="">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ingrese nombre" />
                {errors.name && <div className="errors">{errors.name}</div>}
              </div>
              <div className="singular-data">
                <label htmlFor="">Código País</label>
                <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="Ingrese código país" />
                {errors.countryCode && (<div className="errors">{errors.countryCode}</div>)}
              </div>
              <div className="singular-data">
                <label htmlFor="">Teléfono</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ingrese teléfono" />
                {errors.phone && <div className="errors">{errors.phone}</div>}
              </div>
            </div>
            <div className="content-btn">
              <button type="button" onClick={editingContact !== 0 ? updateContact : addContact} className="btn btn-primary">
                {`${editingContact !== 0 ? "Actualizar contacto" : "Agregar Contacto"}`}
              </button>
            </div>
          </div>
        </div>
        <div className="table-content">
          {/* <p>dfgfg</p> */}
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código País</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactsFiltered.length === 0 && <tr><td colSpan={4}>No tienes contactos</td></tr>}
              {contactsFiltered.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  editContact={editContact}
                  deleteContact={deleteContact}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
