import { ImageUploader } from "@components/PostCreation";
import {
  Avatar,
  Button,
  CircularProgress,
  DialogActions,
  TextareaAutosize,
} from "@mui/material";
import { closeDialog } from "@redux/slices/dialogSlice";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { useCreatePostMutation } from "@services/rootApi";
import { useState } from "react";
import { useDispatch } from "react-redux";

const NewPostDialog = ({ userInfo }) => {
  const [createPost, { data = {}, isSuccess, isLoading }] =
    useCreatePostMutation();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const handleCreateNewPost = async () => {
    try {
      // dung FormData() de co the xu li viec gui du lieu len server theo dang multiple form
      const formData = new FormData();
      formData.append('content', content);  
      formData.append('image', image);
      console.log({formData});
      console.log(formData.get('content'));
      // .unwrap la 1 promise se chi lam lenh tiep theo khi lenh nay dc hoan thanh
      await createPost(formData).unwrap();
      dispatch(closeDialog());
      dispatch(openSnackbar({ message: "Create successfully!" }));
    } catch (e) {
      dispatch(openSnackbar({ type: "error", message: e.data.message }));
    }
  };
  const isValid = !!(content || image);
  return (
    <div>
      <div>
        <div className="flex gap-2 items-center">
          <Avatar
            className="!bg-primary-main "
            sx={{ width: "32px", height: "32px" }}
          >
            {userInfo.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <p className="font-bold">{userInfo.fullName}</p>
        </div>
        <TextareaAutosize
          minRows={3}
          placeholder="What's on your mind?"
          className="w-full mt-4 p-2"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <ImageUploader image={image} setImage={setImage} />
      </div>
      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreateNewPost}
          disabled={!isValid}
        >
          {isLoading ? <CircularProgress size="16px" /> : "Post"}
        </Button>
      </DialogActions>
    </div>
  );
};

export default NewPostDialog;
