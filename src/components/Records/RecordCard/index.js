import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { BiCaretUp, BiMap } from "react-icons/bi"; // Import the upvote icon
import { getAuth } from "firebase/auth";
import firebase_app from "@/utils/firebase/firebase";
import "./index.css";

const auth = getAuth(firebase_app);

const RecordCard = ({ record, user, onUpvote }) => {
  const handleUpvote = () => {
    onUpvote(record.id);
  };

  return (
    <Col sm={12} className="mb-4">
      <Card className="h-100">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Card.Title>{record.title}</Card.Title>
              <Card.Text>{record.desc}</Card.Text>
              <Card.Subtitle className="mb-2 text-muted">
                By: {user ? `${user.displayName}` : "Admin"}
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
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecordCard;
