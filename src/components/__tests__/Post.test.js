import { default as Post } from "@components/Post";
import { render } from "@testing-library/react";

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
});
