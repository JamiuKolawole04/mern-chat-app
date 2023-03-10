import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import botImg from "../assets/images/bot.jpeg";
import { useSignUpUserMutation } from "../services/appApi";
import "./signup.css";

export const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  //image upload status
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [signUpUser, { isLoading, error }] = useSignUpUserMutation();

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    // upload preset gotten from cloudinary
    data.append("upload_preset", "anrthdyo");

    try {
      setUploadingImage(true);
      let response = await fetch(
        "https://api.cloudinary.com/v1_1/drh0fryyw/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const urlData = await response.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (err) {
      alert(err);
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("please upload your profile image");
    const url = await uploadImage(image);
    console.log(url);

    // signup user
    signUpUser({ name, email, password, picture: url }).then((data) => {
      if (data) {
        navigate("/chat");
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
            <h1 className="text-center">Create account</h1>
            <div className="signup-profile-pic__container">
              <img
                src={imagePreview || botImg}
                alt=""
                className="signup-profile-pic"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png,
              image/jpeg"
                onChange={validateImg}
              />
            </div>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {uploadingImage || isLoading ? "Signup now..." : "Signup"}
            </Button>

            <div className="py-4">
              <p className="text-center">
                Already have an account ? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
};
