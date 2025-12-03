import { ImagePlus } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router";

const categories = [
  "",
  "Technology",
  "Lifestyle",
  "Travel",
  "Business",
  "Economy",
  "Sports",
];

interface FormStateType {
  title: string;
  category: string;
  thumbnail: string;
  content: string;
}
export default function PostCreate() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<FormStateType>({
    title: "",
    category: "",
    thumbnail: "",
    content: "",
  });

  const [errorState, setErrorState] = useState<FormStateType>({
    title: "",
    category: "",
    thumbnail: "",
    content: "",
  });

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const [previewImage, setPreviewImage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return null;

    // 유효성 검사(확장자, 용량)
    const allowedExtenstions = ["png", "webp", "jpeg", "jpg"];
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase(); // ***.jpg
    if (!fileExtension || !allowedExtenstions.includes(fileExtension)) {
      alert(`허용된 이미지 확장자는 ${allowedExtenstions.join(", ")} 입니다.`);
      e.target.value = ""; // 초기화 -> 안하면 allowed 안된 확장자 이미지가 alert 만 뜨고 들어옴.
      return null;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("이미지 용량은 10MB 이하만 가능합니다.");
      e.target.value = "";
      return null;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setErrorState((errorState) => ({ ...errorState, thumbnail: "" }));
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleChangeFormState = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormState((formState) => ({
      ...formState,
      [e.target.name]: e.target.value,
    }));
    setErrorState((errorState) => ({ ...errorState, [e.target.name]: "" }));
  };

  const handleFormAction = async () => {
    console.log(formState);
    startTransition(async () => {
      try {
        // 폼 유효성 검사
        const newErrors: FormStateType = {} as FormStateType;
        if (!formState.title.trim()) newErrors.title = "Please enter a title";
        if (!formState.category.trim())
          newErrors.category = "Please select a title category";
        if (!previewImage) newErrors.thumbnail = "Please upload a thumbnail";
        if (!formState.content.trim())
          newErrors.content = "Please enter the content";
        if (Object.keys(newErrors).length > 0) {
          setErrorState(newErrors);
          return null;
        }
      } catch (e) {
        console.error(e instanceof Error ? e.message : "unknown error");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Write New Post</h1>

      <form action={handleFormAction} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter post title"
            value={formState.title}
            onChange={handleChangeFormState}
          />
          {errorState?.title && (
            <p className="text-rose-500 mt-1">{errorState.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formState.category}
            onChange={handleChangeFormState}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "" ? "Select a Category" : category}
              </option>
            ))}
          </select>
          {errorState?.category && (
            <p className="text-rose-500 mt-1">{errorState.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Featured Image
          </label>
          <div className="relative">
            {/* 이미지 선택 후 화면 (미리보기) */}
            {previewImage ? (
              <div className="relative w-full aspect-video mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                  onClick={() => {
                    // preview 이미지 제거(= 빈문자열로 초기화)
                    setPreviewImage("");
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-gray-300">Click to upload image</span>
                  <span className="text-gray-500 text-sm mt-1">
                    PNG, WEBP, JPEG, JPG up to 10MB
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
        {errorState?.thumbnail && (
          <p className="text-rose-500 mt-1">{errorState.thumbnail}</p>
        )}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="w-full h-96 bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write your post content here..."
            value={formState.content}
            onChange={handleChangeFormState}
          />
          {errorState?.content && (
            <p className="text-rose-500 mt-1">{errorState.content}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Publish Post
          </button>
          <button
            type="button"
            className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
