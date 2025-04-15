/**
 * @file Branding Demo
 * @description A demo page showcasing all the brand components and gradient styles
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GradientText, 
  GradientButton, 
  GradientCard,
  GradientBadge,
  GradientDivider,
  GradientBorder
} from '@/components/ui/brand-components';

const BrandingDemo: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <GradientText as="span">CV Branding Buddy</GradientText> - Design System
          </h1>
          <p className="text-muted-foreground">
            A showcase of brand components and gradient styles
          </p>
        </div>
      </div>

      <Tabs defaultValue="text" className="w-full mb-10">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-6">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="borders">Borders</TabsTrigger>
          <TabsTrigger value="dividers">Dividers</TabsTrigger>
        </TabsList>

        {/* Text Gradient Demo */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Text</CardTitle>
              <CardDescription>Text elements with brand gradient styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Static Gradient Text</h2>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Heading Example</h3>
                    <GradientText as="h1" className="text-4xl font-bold">
                      Enhance Your CV with Style
                    </GradientText>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Paragraph Example</h3>
                    <p>
                      Normal text with <GradientText>highlighted gradient phrases</GradientText> that 
                      stand out in your content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Animated Gradient Text</h2>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Animated Heading</h3>
                    <GradientText as="h1" className="text-4xl font-bold" animated>
                      Dynamic CV Branding
                    </GradientText>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Animated Inline Text</h3>
                    <p>
                      Use <GradientText animated>animated gradient text</GradientText> for extra emphasis 
                      on important elements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Demo */}
        <TabsContent value="buttons">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Buttons</CardTitle>
              <CardDescription>Button elements with brand gradient styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Gradient Buttons</h2>
                <div className="flex flex-wrap gap-4">
                  <GradientButton>Primary Action</GradientButton>
                  <GradientButton size="sm">Small Button</GradientButton>
                  <GradientButton size="lg">Large Button</GradientButton>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Comparison with Regular Buttons</h2>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Regular Button</Button>
                  <GradientButton>Gradient Button</GradientButton>
                  <Button variant="outline">Outline Button</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Demo */}
        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Cards</CardTitle>
              <CardDescription>Card elements with gradient borders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Standard Card</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Regular Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>This is a regular card without gradient styling.</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gradient Card</h3>
                  <GradientCard>
                    <CardHeader>
                      <CardTitle>Gradient Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>This card has a beautiful gradient border.</p>
                    </CardContent>
                  </GradientCard>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Demo */}
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Badges</CardTitle>
              <CardDescription>Badge elements with gradient backgrounds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Badge Comparison</h2>
                <div className="flex flex-wrap gap-4">
                  <Badge>Regular Badge</Badge>
                  <GradientBadge>Gradient Badge</GradientBadge>
                  <Badge variant="outline">Outline Badge</Badge>
                  <Badge variant="secondary">Secondary Badge</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Use Cases</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GradientBadge>New Feature</GradientBadge>
                    <span>Highlight new features with gradient badges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GradientBadge>Premium</GradientBadge>
                    <span>Mark premium features with branded styling</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borders Demo */}
        <TabsContent value="borders">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Borders</CardTitle>
              <CardDescription>Elements with gradient borders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Border Variations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thin Border</h3>
                    <GradientBorder borderWidth="thin" className="p-4">
                      <div className="p-4 text-center">Thin gradient border</div>
                    </GradientBorder>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Medium Border</h3>
                    <GradientBorder borderWidth="medium" className="p-4">
                      <div className="p-4 text-center">Medium gradient border</div>
                    </GradientBorder>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thick Border</h3>
                    <GradientBorder borderWidth="thick" className="p-4">
                      <div className="p-4 text-center">Thick gradient border</div>
                    </GradientBorder>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dividers Demo */}
        <TabsContent value="dividers">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Dividers</CardTitle>
              <CardDescription>Horizontal dividers with gradient styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Divider Thicknesses</h2>
                <div className="grid gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thin Divider</h3>
                    <GradientDivider thickness="thin" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Medium Divider</h3>
                    <GradientDivider thickness="medium" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thick Divider</h3>
                    <GradientDivider thickness="thick" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Example Usage</h2>
                <div className="space-y-4">
                  <p>Regular content above divider</p>
                  <GradientDivider />
                  <p>Regular content below divider</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="border rounded-lg p-6 dark:border-gray-700 mb-10">
        <h2 className="text-2xl font-bold mb-4">Dark Mode Compatibility</h2>
        <p className="mb-4">All gradient components work seamlessly in both light and dark modes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <p>Regular card in current theme</p>
          </Card>
          <GradientCard className="p-4">
            <p>Gradient card adapts to dark/light mode</p>
          </GradientCard>
        </div>
      </div>
    </div>
  );
};

export default BrandingDemo; 