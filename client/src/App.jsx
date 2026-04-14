import { Header, Preview, Timeline, TooltipProvider } from './components';

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 h-screen">
        <Header />
        <Preview />
        <Timeline />
      </div>
    </TooltipProvider>
  );
}

export default App;
