import MainPageLayout from '../../layouts/MainPageLayout.jsx'
import ExampleListPage from "./ExampleListPage.jsx";
import ExampleContentPage from "./ExampleContentPage.jsx";

const ExampleLayout = () => {
  return (
    <MainPageLayout
      leftColumn={<ExampleListPage />}
      rightColumn={<ExampleContentPage />}
    />
  );
}

export default ExampleLayout;