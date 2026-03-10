import type { Contact } from "../types";

type Props = {
    contact: Contact;
    editContact: (id: number) => void;
    deleteContact: (id: number) => void;
};

export default function ContactRow({ contact, editContact, deleteContact }: Props) {
    return (
        <tr>
            <td>{contact.name}</td>
            <td>{contact.countryCode}</td>
            <td>{contact.phone}</td>
            <td>
                <div className="btns-actions">
                    <button type="button" onClick={() => editContact(contact.id)}>
                        Editar
                    </button>

                    <button type="button" onClick={() => deleteContact(contact.id)}>
                        ❌
                    </button>
                </div>
            </td>
        </tr>
    );
}