import Image from 'next/image';
import Link from 'next/link';
import { stripPastedFormatting } from '@/app/lib/richText';

interface ImageTextConfig {
  image?: string;
  content?: string;
}

interface ImageTextSectionProps {
  title?: string;
  subtitle?: string;
  config?: ImageTextConfig;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const ImageTextSection = ({
  title,
  subtitle,
  config,
  buttonText,
  buttonLink,
  backgroundColor,
}: ImageTextSectionProps) => {
  const image = config?.image;
  const content = config?.content;

  // Nothing configured yet - stay quiet rather than render an empty section.
  if (!image && !content) return null;

  const bgStyle = backgroundColor ? { backgroundColor } : {};
  const hasButtonLink = buttonLink && buttonLink.trim() !== '';

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-tint md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          {title && (
            <h2 className={`font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center pt-6 md:pt-10 ${subtitle ? 'mb-3 md:mb-4' : 'mb-10 md:mb-16'}`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="font-jost font-light text-center text-gray-600 text-base md:text-lg mb-10 md:mb-16">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Image - left */}
            {image && (
              <div className="flex-shrink-0">
                <div className="relative w-full md:w-[501px] h-[400px] md:h-[569px]">
                  <Image
                    src={image}
                    alt={title || ''}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="object-top"
                  />
                </div>
              </div>
            )}

            {/* Text - right */}
            {content && (
              <div className="flex-1 flex flex-col justify-start">
                <div
                  className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed [&_*]:font-jost! [&_*]:text-inherit! [&_*]:text-[16px]! md:[&_*]:text-[18px]!"
                  style={{ color: '#706C6C' }}
                  dangerouslySetInnerHTML={{ __html: stripPastedFormatting(content) }}
                />
                {hasButtonLink && (
                  <div className="mt-6 md:mt-8">
                    <Link
                      href={buttonLink!}
                      className="inline-block py-3 px-6 bg-[#495D4D] text-white text-sm md:text-base font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors"
                    >
                      {buttonText || 'LEARN MORE'}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
