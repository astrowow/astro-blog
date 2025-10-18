import { asciiArtHtml } from './ascii';
import * as demo from "@/sanity/lib/demo";
import Link from "next/link";

export default function AboutMe() {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: asciiArtHtml }}
      />
      <div className="relative container mx-auto px-5 z-10 flex flex-col min-h-screen text-dark">
        <h2 className="mb-16 mt-10 text-2xl font-semibold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {demo.title}
        </Link>
        </h2>
        <h1 className="text-balance mb-12 text-6xl font-sans  leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">Sobre nosotros</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique, leo id fermentum aliquet, mi quam facilisis sapien, et faucibus elit erat nec lectus. Mauris quis elit in nulla pharetra laoreet quis eget risus. Morbi eu vulputate lacus, et viverra felis. Proin rutrum molestie rutrum. Ut ac finibus lectus, at consequat lectus. Donec rutrum volutpat nibh non luctus. Praesent feugiat posuere ullamcorper. Nam fermentum libero metus, eget lobortis tortor rhoncus sed. Phasellus id sagittis magna. In placerat blandit libero. Proin sed dui id lectus laoreet consequat quis a enim. Etiam mattis libero non fermentum ornare. Integer nisi nisl, pulvinar at auctor in, fermentum at ipsum. Etiam rutrum mauris quam, id varius diam vulputate non. Suspendisse at gravida magna, vitae rhoncus ante. Sed fringilla dignissim orci vitae vehicula.

Etiam rhoncus quam sit amet nunc facilisis, sit amet sollicitudin velit mattis. Quisque ac lobortis nibh. Integer at dolor nec tortor aliquet vestibulum. Praesent vitae porta justo, ut porttitor erat. Integer elementum sed dui sit amet rutrum. Nulla facilisi. Pellentesque non justo nisl.

Aliquam non auctor libero, vitae ultrices ligula. Duis orci velit, accumsan pulvinar purus ac, ullamcorper posuere metus. Curabitur metus tortor, vestibulum at elementum a, dapibus a dui. Nunc auctor blandit augue, id facilisis purus vestibulum in. Suspendisse non massa ipsum. Sed quis pulvinar sapien. Integer eleifend venenatis fermentum. Sed vehicula risus metus. Curabitur lobortis finibus dapibus. Morbi lacinia tellus sem, id efficitur nisl consequat sit amet. Praesent vestibulum nulla et ex auctor convallis. Maecenas augue lorem, fringilla vitae porttitor sed, dictum et metus. Ut quis lorem elementum, luctus nisi et, tincidunt augue.

Phasellus ultrices felis mi, eu lacinia elit facilisis sit amet. Etiam aliquam pulvinar ante. Morbi imperdiet felis vitae consequat pretium. Vivamus a feugiat urna, sed tincidunt nisi. Nunc erat nisl, eleifend vitae nisl ac, congue pellentesque risus. Pellentesque mauris leo, gravida a libero lobortis, porttitor efficitur dolor. Curabitur ornare lorem sapien, ac efficitur justo semper a. Phasellus a sem eu orci pulvinar viverra. Integer non ullamcorper dolor. Mauris vestibulum aliquam enim ac interdum. Proin sed urna eu nisl bibendum pellentesque. Nam nec iaculis sem. Donec sit amet felis a massa semper molestie. Maecenas eu arcu eget libero tristique luctus. Praesent et orci nec leo commodo fringilla mollis sed metus.</p>
      </div>
    </div>
  );
}