import "./Layout.scss";

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <>
      <div className="content">
        <div className="main-content">{children}</div>
      </div>
    </>
  );
};

export default Layout;
