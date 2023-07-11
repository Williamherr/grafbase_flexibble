"use client";
import { SessionInterface } from "@/common.types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import FormFields from "./FormFields";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import { createNewProject, fetchToken } from "@/lib/actions";
import { useRouter } from "next/navigation";

type Props = {
  type: string;
  session: SessionInterface;
};

const ProjectForm = ({ type, session }: Props) => {
  const rounter = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { token } = await fetchToken();

    try {
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token);
        rounter.push("/");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange("image", result);
    };
  };

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    image: "",
    title: "",
    description: "",
    liveSiteUrl: "",
    githubUrl: "",
    category: "",
  });
  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form?.image && "Choose a poster for your project"}
          <input
            id="image"
            type="file"
            accept="image/*"
            required={type === "create" ? true : false}
            className="form_image-input"
            onChange={handleChangeImage}
          />
        </label>
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="Project poster"
            fill
          />
        )}
      </div>
      <FormFields
        title="Title"
        state={form.title}
        placeholder="Flexibble"
        setState={(value) => handleStateChange("title", value)}
      />
      <FormFields
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects"
        setState={(value) => handleStateChange("description", value)}
      />
      <FormFields
        type="url"
        title="Website Url"
        state={form.liveSiteUrl}
        placeholder="https://3d-portfolio-chi-silk.vercel.app/"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />
      <FormFields
        type={type}
        title="Github URL"
        state={form.githubUrl}
        placeholder="https://github.com/Williamherr"
        setState={(value) => handleStateChange("githubUrl", value)}
      />
      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />
      <div className="flexStart w-full">
        <Button
          title={
            submitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          leftIcon={submitting ? "" : "/plus.svg"}
          submitting={submitting}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
