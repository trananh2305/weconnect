import { default as Post } from "@components/Post";
import { useUserInfo } from "@hooks/index";
import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";

jest.mock("@hooks/index", () => ({
  useUserInfo: jest.fn(),
}));

beforeEach(() => {
  useUserInfo.mockReturnValue({
    fullName: "Test User",
  });
});

// desribe dung de mo ta 1 nhom test
describe("Post component", () => {
  test("renders the post content correctly", () => {
    // render dung de render component can test
    const { getByText } = render(
      <Post fullName="Anh" content="hehe" createdAt={Date.now()} />
    );
    // expect dung de kiem tra ket qua mong muon
    expect(getByText("hehe")).toBeInTheDocument();
  });
  // test ui
  test("display the correct number of likes", () => {
    const likes = [1, 2, 3];
    const { getByText } = render(
      <Post
        fullName="Anh"
        content="hehe"
        createdAt={Date.now()}
        likes={likes}
      />
    );
    expect(getByText("3")).toBeInTheDocument();
  });
  // test function
  test("calls onLike with id when like button is cliked", () => {
    const mockOnLike = jest.fn();
    render(
      <Post
        postId="anh123"
        fullName="Anh"
        content="hehe"
        createdAt={Date.now()}
        onLike={mockOnLike}
      />
    );

    const likeButton = screen.getByText("Like");

    fireEvent.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith("anh123");
  });
});

test("renders an image when image prop is available", () => {
  render(
    <Post
      postId="anh123"
      fullName="Anh"
      content="hehe"
      createdAt={Date.now()}
      image="http://example.com/image.jpg"
    />
  );
  const imageElm = screen.getByRole("img");
  expect(imageElm).toBeInTheDocument();
  expect(imageElm).toHaveAttribute("src", "http://example.com/image.jpg");
});

test("renders correct number of comments", () => {
  const comments = [
    {
      _id: "1",
      comment: "Comment 1",
      createdAt: dayjs().toISOString(),
      author: {
        _id: "a1",
        fullName: "Anh",
      },
    },
    {
      _id: "2",
      comment: "Comment 2",
      createdAt: dayjs().toISOString(),
      author: {
        _id: "a2",
        fullName: "Anh tran",
      },
    },
  ];
  render(
    <Post
      postId="anh123"
      fullName="Anh"
      content="hehe"
      createdAt={Date.now()}
      comments={comments}
    />
  );
  expect(screen.getByText("2 comments")).toBeInTheDocument();
});

test("toggles comment box when comment button is clicked", () => {
  render(
    <Post
      postId="anh123"
      fullName="Anh"
      content="hehe"
      createdAt={Date.now()}
      comments={[]}
    />
  );
  expect(screen.queryByPlaceholderText("Comment here...")).toBeNull();
  const commentBtn = screen.getByText("Comment");
  fireEvent.click(commentBtn);
  expect(screen.queryByPlaceholderText("Comment here...")).toBeInTheDocument();
});

test("calls  onComment callback when sending a comment", () => {
  const mockOnComment = jest.fn();
  render(
    <Post
      postId="anh123"
      fullName="Anh"
      content="hehe"
      createdAt={Date.now()}
      comments={[]}
      onComment={mockOnComment}
    />
  );
  const commentBtn = screen.getByText("Comment");
  fireEvent.click(commentBtn);

  const commentInput = screen.getByPlaceholderText("Comment here...");
  fireEvent.change(commentInput, { target: { value: "Comment 1" } });

  const sendBtn = screen.getByTestId("send-comment");
  fireEvent.click(sendBtn);

  expect(mockOnComment).toHaveBeenCalledWith( "anh123","Comment 1");
});
