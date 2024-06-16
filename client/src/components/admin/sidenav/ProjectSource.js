import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config";
import { v4 as uuidv4 } from 'uuid';

const ProjectSource = () => {
  const [links, setLinks] = useState([]);
  const [texts, setTexts] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [newTextTag, setNewTextTag] = useState("");
  const [newText, setNewText] = useState("");
  const [editTextId, setEditTextId] = useState(null);
  const [editTextValue, setEditTextValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/project/details");
        const data = response.data.source;
        setLinks(data.link || []);
        setTexts(data.text || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLinks([]);
        setTexts([]);
      }
    };

    fetchData();
  }, []);

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (newLink.trim() !== "") {
      try {
        await axiosInstance.post("/api/project/source/link", { tag: newLink });
        const updatedLinks = [...links, { id: uuidv4(), tag: newLink, isUpdated: false, addedAt: new Date() }];
        setLinks(updatedLinks);
        setNewLink("");
      } catch (error) {
        console.error("Error adding link:", error);
      }
    }
  };

  const handleAddText = async (e) => {
    e.preventDefault();
    if (newTextTag.trim() !== "" && newText.trim() !== "") {
      const newTextData = { id: uuidv4(), tag: newTextTag, value: newText, isUpdated: false, addedAt: new Date() };
      try {
        await axiosInstance.post("/api/project/source/text", newTextData);
        const updatedTexts = [...texts, newTextData];
        setTexts(updatedTexts);
        setNewTextTag("");
        setNewText("");
      } catch (error) {
        console.error("Error adding text:", error);
      }
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await axiosInstance.delete(`/api/project/source/link/${id}`);
      const updatedLinks = links.filter((item) => item.id !== id);
      setLinks(updatedLinks);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleDeleteText = async (id) => {
    try {
      await axiosInstance.delete(`/api/project/source/text/${id}`);
      const updatedTexts = texts.filter((text) => text.id !== id);
      setTexts(updatedTexts);
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const handleEditText = (id, value) => {
    setEditTextId(id);
    setEditTextValue(value);
  };

  const handleSaveText = async (id) => {
    try {
      await axiosInstance.put(`/api/project/source/text/${id}`, { value: editTextValue });
      const updatedTexts = texts.map((text) =>
        text.id === id ? { ...text, value: editTextValue, isUpdated: true, updatedAt: new Date() } : text
      );
      setTexts(updatedTexts);
      setEditTextId(null);
      setEditTextValue("");
    } catch (error) {
      console.error("Error saving text:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Source</h2>
      <div className="mb-4">
        <label htmlFor="links" className="form-label text-xl">Add Source Links</label>
        <p>Bot will use this sources to learn itself about the project</p>
        <form className="input-group mb-3" onSubmit={handleAddLink}>
          <input
            type="text"
            className="form-control"
            id="links"
            placeholder="Enter link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            required
          />
          <button className="btn btn-outline-secondary ml-2" type="submit">Add Link</button>
        </form>
        <ul className="list-group">
          {links.map((link) => (
            <li key={link.id} className="list-group-item">
              <p className="d-inline-block">{link.tag}</p>
              <button
                className="btn btn-sm btn-outline-secondary ml-2 fs-2"
                type="button"
                onClick={() => handleDeleteLink(link.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {links.length === 0 && <p>No links found or error while fetching.</p>}
      </div>
      <div className="mb-4">
        <form onSubmit={handleAddText}>
          <div className="mb-3">
            <p className="text-xl font-bold">Add Manual sources</p>
            <label htmlFor="textTag" className="form-label">Content Tag</label>
            <input
              type="text"
              className="form-control"
              id="textTag"
              placeholder="Enter text tag"
              value={newTextTag}
              onChange={(e) => setNewTextTag(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="text" className="form-label">Content</label>
            <textarea
              className="form-control"
              id="text"
              placeholder="Enter text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-outline-secondary" type="submit">Add Text</button>
        </form>
        <ul className="list-group mt-3">
          {texts.map((textData) => (
            <li key={textData.id} className="list-group-item">
              <strong>{textData.tag}:</strong>
              {editTextId === textData.id ? (
                <>
                  <textarea
                    className="form-control mt-2"
                    value={editTextValue}
                    onChange={(e) => setEditTextValue(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary mt-2"
                    type="button"
                    onClick={() => handleSaveText(textData.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>{textData.value}</p>
                  <button
                    className="btn btn-outline-secondary mt-2 mr-2"
                    type="button"
                    onClick={() => handleEditText(textData.id, textData.value)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-secondary mt-2"
                    type="button"
                    onClick={() => handleDeleteText(textData.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {texts.length === 0 && <p>No texts found or error while fetching.</p>}
    </div>
  );
};

export default ProjectSource;
