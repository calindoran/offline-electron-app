import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Check, Info } from 'lucide-react'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const Route = createFileRoute('/examples')({
  component: RouteComponent,
})

function RouteComponent() {
  const [checkboxChecked, setCheckboxChecked] = React.useState(false)
  const [switchChecked, setSwitchChecked] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState([50])
  const [progressValue, setProgressValue] = React.useState(33)
  const [radioValue, setRadioValue] = React.useState('option1')

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">UI Components Examples</h1>
        <p className="text-muted-foreground">
          A showcase of all available UI components with neobrutalism styling
        </p>
      </div>

      {/* Buttons */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Check className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="reverse">Reverse</Button>
            <Button variant="noShadow">No Shadow</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Badge variants for labels and status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="default">
              <Check className="w-3 h-3 mr-1" />
              With Icon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
          <CardDescription>Input fields, checkboxes, switches, and more</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="example-input">Input Field</Label>
            <Input id="example-input" placeholder="Enter some text..." />
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <Label htmlFor="example-textarea">Textarea</Label>
            <Textarea id="example-textarea" placeholder="Enter a longer message..." />
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="example-checkbox"
              checked={checkboxChecked}
              onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
            />
            <Label htmlFor="example-checkbox" className="cursor-pointer">
              Accept terms and conditions (Checked: {checkboxChecked ? 'Yes' : 'No'})
            </Label>
          </div>

          {/* Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="example-switch" className="cursor-pointer">
              Enable notifications (Status: {switchChecked ? 'On' : 'Off'})
            </Label>
            <Switch
              id="example-switch"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
          </div>

          {/* Radio Group */}
          <div className="space-y-2">
            <Label>Radio Group (Selected: {radioValue})</Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1" className="cursor-pointer">
                  Option 1
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2" className="cursor-pointer">
                  Option 2
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3" className="cursor-pointer">
                  Option 3
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Select */}
          <div className="space-y-2">
            <Label>Select Dropdown</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
                <SelectItem value="option4">Option 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Slider and Progress */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Slider & Progress</CardTitle>
          <CardDescription>Interactive slider and progress indicator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Slider (Value: {sliderValue[0]})</Label>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Progress Bar</Label>
              <span className="text-sm text-muted-foreground">{progressValue}%</span>
            </div>
            <Progress value={progressValue} />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
                Increase
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
              >
                Decrease
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Alert messages with different variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <Info className="w-4 h-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with information for the user.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>
              This is a destructive alert indicating an error or warning.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
          <CardDescription>User avatars with images and fallbacks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>XY</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Tabbed navigation interface</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p>This is the content for Tab 1. You can put any content here.</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p>This is the content for Tab 2. Switch between tabs to see different content.</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p>This is the content for Tab 3. Tabs are great for organizing content.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>Collapsible content sections</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern and follows best practices for
                accessibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that match the neobrutalism design system.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it customizable?</AccordionTrigger>
              <AccordionContent>
                Yes. You can customize the accordion by passing additional props and className
                overrides.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Dialog, Popover, Tooltip */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Overlays</CardTitle>
          <CardDescription>Dialogs, popovers, and tooltips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog component. You can put forms, confirmations, or any content
                    here.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialog-input">Name</Label>
                    <Input id="dialog-input" placeholder="Enter your name" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="noShadow">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-main-foreground">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-heading">Popover Title</h4>
                    <p className="text-sm">
                      This is a popover component. Great for additional information or quick
                      actions.
                    </p>
                  </div>
                  <Button size="sm" className="w-full" variant="neutral">
                    Action
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tooltip */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-white">This is a tooltip with helpful information!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Cards Showcase */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle>Card Variations</CardTitle>
          <CardDescription>Different card layouts and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Card 1</CardTitle>
                <CardDescription>Simple card with header</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Card content goes here. Cards are great for organizing content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Card 2</CardTitle>
                <CardDescription>Another card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  You can nest any content inside cards including buttons and forms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Card 3</CardTitle>
                <CardDescription>Third card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Cards support the neobrutalism style with bold borders and shadows.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
