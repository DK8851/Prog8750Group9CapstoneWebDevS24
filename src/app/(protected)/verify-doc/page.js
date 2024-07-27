  "use client";

  import React, { useState, useEffect } from "react";
  import Form from "react-bootstrap/Form";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { toast } from "react-toastify";
  import { useRouter } from "next/navigation";
  import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    limit,
    addDoc,
    doc,
    deleteDoc,
  } from "firebase/firestore";

  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";

  import BG from "@/components/Bg";
  import RoundButton from "@/components/RoundButton";
  import firebase_app from "@/utils/firebase/firebase";
  import { Container, Row, Col } from "react-bootstrap";

  const auth = getAuth(firebase_app);
  const db = getFirestore(firebase_app);
  const storage = getStorage(firebase_app);

  const VerifyDocPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ userEditId: "", docFile: null });
    const [errors, setErrors] = useState({ docFile: "" });
    const [uploadedDocs, setUploadedDocs] = useState([]);

    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = collection(db, "users");
          const _userDocQuery = query(
            userDocRef,
            where("uid", "==", user.uid),
            limit(1)
          );

          const userDoc = await getDocs(_userDocQuery);
          if (userDoc.docs.length == 1 && userDoc.docs[0].exists()) {
            console.log(userDoc.docs[0]);
            setFormData((prevState) => ({
              ...prevState,
              userEditId: userDoc.docs[0].id,
            }));

            await fetchUploadedDocs(userDoc.docs[0].id);
          }
        } else {
          router.push("/login");
        }
      });
    }, [router]);

    const handleFileChange = (e) => {
      setFormData({ ...formData, docFile: e.target.files[0] });
      setErrors({ ...errors, docFile: "" }); // Resetting error message on change
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.userEditId) {
        toast.error("Please Login First!");
        router.push("/login");
        return;
      }

      if (!formData.docFile) {
        setErrors({ docFile: "Document is required" });
        return;
      }

      await uploadDocument(formData.docFile);
    };

    const uploadDocument = async (file) => {
      const uploadDocLoading = toast.loading("Uploading document...");

      try {
        const storageRef = ref(
          storage,
          `user_docs/${formData.userEditId}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring can be implemented here if needed
          },
          (error) => {
            console.error(error);
            toast.update(uploadDocLoading, {
              render: "Failed to upload document",
              type: "error",
              isLoading: false,
              autoClose: true,
            });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await fetchUploadedDocs(formData.userEditId);
            await createDocEntry(downloadURL);

            toast.update(uploadDocLoading, {
              render: "Document uploaded successfully",
              type: "success",
              isLoading: false,
              autoClose: true,
            });
            console.log("Document URL:", downloadURL);
          }
        );
      } catch (error) {
        console.error(error);
        toast.update(uploadDocLoading, {
          render: "Failed to upload document",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
      }
    };

    const createDocEntry = async (downloadURL) => {
      try {
        await addDoc(collection(db, "docs"), {
          userId: formData.userEditId,
          docUrls: [downloadURL],
          isPending: true,
          isApproved: false,
          madeDecision: false,
        });
      } catch (error) {
        console.error("Error creating document entry: ", error);
      }
    };

    const fetchUploadedDocs = async (userId) => {
      try {
        const docsRef = collection(db, "docs");
        const docsQuery = query(docsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(docsQuery);

        const urls = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.docUrls) {
            urls.push(data);
          }
        });

        setUploadedDocs(urls);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    const deleteDocument = async (url) => {
      const deleteDocLoading = toast.loading("Deleting document...");

      try {
        // Find the document in Firestore
        const docsRef = collection(db, "docs");
        const docsQuery = query(
          docsRef,
          where("userId", "==", formData.userEditId)
        );
        const querySnapshot = await getDocs(docsQuery);

        let docId = null;
        let docUrls = [];

        querySnapshot.forEach((doc) => {
          if (doc.data().docUrls.includes(url)) {
            docId = doc.id;
            docUrls = doc.data().docUrls.filter((docUrl) => docUrl !== url);
          }
        });

        if (docId) {
          const docRef = doc(db, "docs", docId);

          // Update the document in Firestore
          // await updateDoc(docRef, { docUrls });
          await deleteDoc(docRef);

          // Delete the file from Storage
          const fileRef = ref(storage, url);
          await deleteObject(fileRef);

          // Update the state
          // setUploadedDocs(docUrls);

          toast.update(deleteDocLoading, {
            render: "Document deleted successfully",
            type: "success",
            isLoading: false,
            autoClose: true,
          });
        } else {
          toast.update(deleteDocLoading, {
            render: "Document not found",
            type: "error",
            isLoading: false,
            autoClose: true,
          });
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast.update(deleteDocLoading, {
          render: "Failed to delete document",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
      }
    };

    return (
      <div>
        <BG />
        <div className="container py-5">
          <h2 className="text-center fw-bolder">Verify Document</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicDoc">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                className="rounded-pill"
                type="file"
                name="docFile"
                onChange={handleFileChange}
                isInvalid={!!errors.docFile}
                disabled={uploadedDocs.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                {errors.docFile}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center">
              <RoundButton
                text="Upload Document"
                size="md"
                newclass="text-uppercase"
                disabled={uploadedDocs.length > 0}
              />
            </div>
          </Form>
          <div className="mt-5">
            <h3 className="text-center fw-bolder">Uploaded Documents</h3>
            <Container>
              <Row>
                {uploadedDocs.map((url, index) => {
                  console.log("url LL ", url);
                  return (
                    <Col
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={index}
                      className="mb-3"
                    >
                      <div className="text-center position-relative">
                        <img
                          src={url.docUrls}
                          alt={`Uploaded document ${index + 1}`}
                          className="img-fluid"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />

                        {!url.madeDecision && (
                          <button
                            className="btn btn-primary position-absolute top-0 end-0"
                            style={{ zIndex: 1 }}
                            onClick={() => deleteDocument(url.docUrls)}
                          >
                            &times;
                          </button>
                        )}

                        {url.madeDecision && url.isApproved && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                            <span className="text-white fw-bold">Approved</span>
                          </div>
                        )}

                        {url.madeDecision && !url.isApproved && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                            <span className="text-white fw-bold">Rejected</span>
                          </div>
                        )}

                        {!url.madeDecision && url.isPending && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                            <span className="text-white fw-bold">Pending</span>
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </div>
        </div>
      </div>
    );
  };

  export default VerifyDocPage;
