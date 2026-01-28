import { Separator } from '@/components/ui/separator';
import { GradientPresets } from '@/components/controls/GradientPresets';
import { CustomGradientCreator } from '@/components/controls/CustomGradientCreator';
import { SizeSelector } from '@/components/controls/SizeSelector';
import { FrameControls } from '@/components/controls/FrameControls';
import { LayersList } from '@/components/layers/LayersList';
import { Footer } from '@/components/layout/Footer';

export function Sidebar() {
  return (
    <div className="neu-panel flex flex-col m-4 overflow-hidden">
      <GradientPresets />
      <Separator className="my-2 opacity-30" />
      <CustomGradientCreator />
      <Separator className="my-2 opacity-30" />
      <SizeSelector />
      <Separator className="my-2 opacity-30" />
      <FrameControls />
      <Separator className="my-2 opacity-30" />
      <LayersList />
      <Separator className="my-2 opacity-30" />
      <Footer />
    </div>
  );
}
