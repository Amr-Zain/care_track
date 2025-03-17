import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadProfileImg } from "../../../api/data";
import { useDispatch } from "react-redux";
import { setImage } from "../../../features/authedUser";

function ImageForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch()
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPEG/PNG images are allowed");
            return false;
        }
        if (file.size > maxSize) {
            toast.error("Image size must be less than 5MB");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            toast.error("Please select an image");
            return;
        }

        if (!validateFile(selectedFile)) return;

        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const url = await toast.promise(
                uploadProfileImg(formData),
                {
                    pending: 'Uploading image...',
                    success: "Image uploaded successfully!",
                    error: {
                        render({ error }) {
                            return error.response?.data?.message || 'Image upload failed';
                        }
                    }
                }
            );
            dispatch(setImage({url}))
        } catch (error) {
            // Error handled by toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                    disabled={isSubmitting}
                />
                <Form.Text className="text-muted">
                    Select a single image (JPEG/PNG, max 5MB)
                </Form.Text>

                {selectedFile && (
                    <div className="mt-2">
                        <h6>Selected File:</h6>
                        <p>{selectedFile.name}</p>
                    </div>
                )}
            </Form.Group>

            <div className="d-grid gap-2">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span className="ms-2">Uploading...</span>
                        </>
                    ) : (
                        'Upload Image'
                    )}
                </Button>
            </div>
        </Form>
    );
}

export default ImageForm;