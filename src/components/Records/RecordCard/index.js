import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { BiCaretUp, BiMap, BiTrash } from "react-icons/bi"; // Import the upvote icon
import { getAuth } from "firebase/auth";
import firebase_app from "@/utils/firebase/firebase";
import "./index.css";

const auth = getAuth(firebase_app);

const RecordCard = ({ record, user, onUpvote, showDeleteButton, onDelete }) => {
  const handleUpvote = () => {
    onUpvote(record.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      onDelete(record.id);
    }
  };

  const date = new Date(record.createdAt.seconds * 1000);
  const formattedDate = date.toLocaleString();

  return (
    <Col sm={12} className="mb-4">
      <Card className="h-100">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Card.Title>{record.title}</Card.Title>
              <Card.Text>{record.desc}</Card.Text>
              <Card.Subtitle className="mb-2 text-muted">
                By: {user ? `${user.displayName}` : "Admin"} <br />
                Date: {formattedDate}
              </Card.Subtitle>
              <Card.Text className="d-flex align-items-center">
                <strong>
                  <BiMap size={"1.5rem"} />
                </strong>{" "}
                <a
                  href={record.location}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Location
                </a>
              </Card.Text>
            </Col>
            <Col xs="auto" className="text-center">
              <div className="button-container">
                <Button
                  variant="link"
                  className={`p-0 ${
                    record.upvotes?.[auth.currentUser?.uid]
                      ? "text-primary"
                      : ""
                  }`}
                  onClick={handleUpvote}
                >
                  <BiCaretUp size="2em" />
                </Button>
                <div className="text-muted">{record.upvoteCount || 0}</div>
                {showDeleteButton && (
                  <Button
                    variant="link"
                    className="text-danger mt-2"
                    onClick={handleDelete}
                  >
                    <BiTrash size="1.5em" />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecordCard;
