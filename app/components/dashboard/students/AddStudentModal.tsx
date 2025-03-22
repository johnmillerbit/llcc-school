'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@heroui/react';

interface AddStudentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (studentData: {
    firstname: string;
    lastname: string;
    class: string;
    semester: string;
    birthdate: string;
  }) => void;
}

export default function AddStudentModal({ isOpen, onOpenChange, onSubmit }: AddStudentModalProps) {
  const classOptions = [
    { key: 'a', label: 'Class A' },
    { key: 'b', label: 'Class B' },
    { key: 'c', label: 'Class C' },
  ];

  const semesterOptions = [
    { key: '2023-2024', label: '2023-2024' },
    { key: '2024-2025', label: '2024-2025' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string,
      class: formData.get('class') as string,
      semester: formData.get('semester') as string,
      birthdate: formData.get('birthdate') as string,
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Add New Student</ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="First Name"
                    name="firstname"
                    placeholder="Enter first name"
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    name="lastname"
                    placeholder="Enter last name"
                    isRequired
                  />
                  <Select
                    label="Class"
                    name="class"
                    placeholder="Select a class"
                    isRequired
                  >
                    {classOptions.map((option) => (
                      <SelectItem key={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Semester"
                    name="semester"
                    placeholder="Select a semester"
                    isRequired
                  >
                    {semesterOptions.map((option) => (
                      <SelectItem key={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Birth Date"
                    name="birthdate"
                    type="date"
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Add Student
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}