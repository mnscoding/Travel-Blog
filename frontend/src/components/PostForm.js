/*
import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const PostForm = () => {
  const { dispatch } = usePostsContext();

  const { user } = useAuthContext();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const post = { location, description };

    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setLocation("");
      setDescription("");

      setError(null);
      console.log("new post added", json);
      dispatch({ type: "CREATE_POST", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new post</h3>

      <label>Location:</label>
      <input
        type="text"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        className={emptyFields.includes("location") ? "error" : ""}
      />
      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes("description") ? "error" : ""}
      />

      <button>Add Post</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;*/

import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const PostForm = () => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("location", location);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo); // key must match backend multer field
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
        // ❌ DON'T set "Content-Type" — browser will set it automatically
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    } else {
      setLocation("");
      setDescription("");
      setPhoto(null);
      setError(null);
      setEmptyFields([]);
      console.log("new post added", json);
      dispatch({ type: "CREATE_POST", payload: json });
    }
  };

  return (
    <form
      className="create"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h3>Add a new post</h3>

      <label>Location:</label>
      <input
        type="text"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        className={emptyFields.includes("location") ? "error" : ""}
      />

      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes("description") ? "error" : ""}
      />

      <label>Photo:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button>Add Post</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;
