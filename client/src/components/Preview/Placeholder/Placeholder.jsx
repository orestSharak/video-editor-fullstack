import { Card, CardContent } from '@/components';

export function Placeholder() {
  return (
    <Card className="aspect-video h-80 bg-muted flex items-center justify-center">
      <CardContent>
        <p className="text-muted-foreground text-sm uppercase">Preview Area</p>
      </CardContent>
    </Card>
  );
}
