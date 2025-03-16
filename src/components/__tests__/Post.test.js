import { default as Post } from "@components/Post";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@hooks/index", () => ({
  useUserInfo: jest.fn(),
}));

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
  <Post
    postId="anh123"
    fullName="Anh"
    content="hehe"
    createdAt={Date.now()}
    image="http://example.com/image.jpg"
  />;
  const imageElm = screen.getByRole("img");
  expect(imageElm).toBeInTheDocument();
  expect(imageElm).toHaveAttribute("src", "http://example.com/image.jpg");
});
