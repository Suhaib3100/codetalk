'use client';

import {
  useEffect,
  useState,
  Fragment,
  type ReactElement,
  type HTMLAttributes,
  type ReactNode,
  type HTMLProps,
} from 'react';
import { TerminalIcon } from 'lucide-react';
import Link from 'next/link';
import scrollIntoView from 'scroll-into-view-if-needed';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

export function CreateAppAnimation() {
  const installCmd = 'npm install codetalk';
  const tickTime = 100;
  const timeCommandEnter = installCmd.length;
  const timeCommandRun = timeCommandEnter + 3;
  const timeCommandEnd = timeCommandRun + 3;
  const timeWindowOpen = timeCommandEnd + 1;
  const timeEnd = timeWindowOpen + 1;

  const [tick, setTick] = useState(timeEnd);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= timeEnd ? prev : prev + 1));
    }, tickTime);

    return () => {
      clearInterval(timer);
    };
  }, [timeEnd]);

  const lines: ReactElement[] = [];

  lines.push(
    <span key="command_type">
      {installCmd.substring(0, tick)}
      {tick < timeCommandEnter && (
        <div className="inline-block h-3 w-1 animate-pulse bg-white" />
      )}
    </span>,
  );

  if (tick >= timeCommandEnter) {
    lines.push(<span key="space"> </span>);
  }

  if (tick > timeCommandRun)
    lines.push(
      <Fragment key="command_response">
        <span className="font-bold">┌ npx codetalk</span>
        <span>│</span>
        {tick > timeCommandRun + 1 && (
          <>
            <span className="font-bold">◇ Select the project directory</span>
            <span>│ JS</span>
          </>
        )}
        {tick > timeCommandRun + 2 && (
          <>
            <span>│</span>
            <span className="font-bold">◆ Choose a Type of comment</span>
          </>
        )}
        {tick > timeCommandRun + 3 && (
          <>
            <span>│ ● Basic comments</span>
            <span>│ ○ Advanced comments</span>
          </>
        )}
      </Fragment>,
    );

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (tick >= timeEnd) {
          setTick(0);
        }
      }}
    >
      {tick > timeWindowOpen && (
        <LaunchAppWindow className="absolute bottom-5 right-4 z-10 animate-in fade-in slide-in-from-top-10" />
      )}
      <pre className="overflow-hidden rounded-xl border text-xs">
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2">
          <TerminalIcon className="size-4" />{' '}
          <span className="font-bold">Terminal</span>
          <div className="grow" />
          <div className="size-2 rounded-full bg-red-400" />
        </div>
        <div className="min-h-[200px] bg-gradient-to-b from-fd-secondary [mask-image:linear-gradient(to_bottom,white,transparent)]">
          <code className="grid p-4">{lines}</code>
        </div>
      </pre>
    </div>
  );
}

function LaunchAppWindow(
  props: HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden rounded-md border bg-fd-background shadow-xl',
        props.className,
      )}
    >
      <div className="relative flex h-6 flex-row items-center border-b bg-fd-muted px-4 text-xs text-fd-muted-foreground">
        <p className="absolute inset-x-0 text-center">localhost:3000</p>
      </div>
      <div className="p-4 text-sm">New App launched!</div>
    </div>
  );
}

export function WhyInteractive(props: {
  codeblockTheme: ReactNode;
  codeblockSearchRouter: ReactNode;
  codeblockInteractive: ReactNode;
  typeTable: ReactNode;
  codeblockMdx: ReactNode;
}) {
  const [autoActive, setAutoActive] = useState(true);
  const [active, setActive] = useState(0);
  const duration = 1000 * 8;
  const items = [
    'AI-Powered Code Commenting',
    'Easy Installation',
    'Interactive CLI',
    'Flexible Commenting Styles',
    'Supports Multiple Languages',
    'Open Source',
  ];

  useEffect(() => {
    if (!autoActive) return;
    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [active, autoActive, duration, items.length]);

  return (
    <div
      id="why-interactive"
      className="-mx-6 mt-8 flex flex-col gap-4 rounded-lg border border-foreground/10 bg-fd-muted/50 p-4 shadow-lg lg:flex-row lg:gap-6 lg:p-6"
    >
      <div className="-mt-1.5 flex flex-row overflow-x-auto max-lg:-mx-4 max-lg:items-center max-lg:px-2 lg:-ml-4 lg:flex-col">
        {items.map((item, i) => (
          <button
            key={item}
            ref={(element) => {
              if (!element || i !== active) return;

              scrollIntoView(element, {
                behavior: 'smooth',
                boundary: document.getElementById('why-interactive'),
              });
            }}
            type="button"
            className={cn(
              'inline-flex flex-col-reverse text-nowrap rounded-lg py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors max-lg:px-2 lg:flex-row',
              i === active
                ? 'text-primary max-lg:bg-primary/10'
                : 'hover:text-accent-foreground/80',
              i === active && autoActive ? '' : 'max-lg:pb-2.5 lg:pl-3',
            )}
            onClick={() => {
              if (active === i) setAutoActive((prev) => !prev);
              else {
                setAutoActive(false);
                setActive(i);
              }
            }}
          >
            {i === active && autoActive ? (
              <div
                className="animate-[why-interactive-x] rounded-lg bg-primary max-lg:h-1 lg:mr-2 lg:w-1 lg:animate-[why-interactive-y]"
                style={{
                  animationDuration: `${duration.toString()}ms`,
                  animationFillMode: 'forwards',
                }}
              />
            ) : null}
            {item}
          </button>
        ))}
      </div>
      <style>
        {`
        @keyframes why-interactive-x {
          from {
            width: 0px;
          }
          
          to {
            width: 100%;
          }
        }
        
        @keyframes why-interactive-y {
          from {
            height: 0px;
          }
          
          to {
            height: 100%;
          }
        }`}
      </style>

      <div className="flex-1">
        {active === 0 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">
              AI-Powered Code Commenting Made Easy.
            </h3>
            <p>
              Codetalk offers intelligent code commenting using OpenAI, making your codebase more understandable and maintainable.
            </p>
            <p className="mb-4 text-muted-foreground">
              Simply install and run the CLI to start adding comments to your code.
            </p>
            <div className="flex flex-row items-center gap-1.5">
              <Link
                href="/docs/installation"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Installation Guide
              </Link>
              <Link
                href="/docs/usage"
                className={cn(buttonVariants({ variant: 'ghost' }))}
              >
                Usage Instructions
              </Link>
            </div>
          </WhyPanel>
        ) : null}

        {active === 1 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">Easy Installation</h3>
            <p>
              Install Codetalk with a single command:
            </p>
            <Link
              href="/docs/installation"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              See Installation Docs
            </Link>
          </WhyPanel>
        ) : null}

        {active === 2 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">
              Interactive CLI for Seamless Experience.
            </h3>
            <p>
              Codetalk provides an interactive command-line interface that guides you through the commenting process.
            </p>
            {props.codeblockInteractive}
            <Link
              href="/docs/ui/components"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              View CLI Components
            </Link>
          </WhyPanel>
        ) : null}

        {active === 3 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">
              Flexible Commenting Styles.
            </h3>
            <p>
              Choose between basic and advanced commenting styles to suit your needs.
            </p>
            {props.codeblockMdx}
          </WhyPanel>
        ) : null}

        {active === 4 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">
              Supports Multiple Programming Languages.
            </h3>
            <p>
              Codetalk works with various languages including JavaScript, Python, Java, and more.
            </p>
            <Link
              href="/docs/languages"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Supported Languages
            </Link>
          </WhyPanel>
        ) : null}

        {active === 5 ? (
          <WhyPanel>
            <h3 className="mb-2 text-lg font-semibold">
              Open Source and Community Driven.
            </h3>
            <p>
              Codetalk is open source, allowing contributions and improvements from the community.
            </p>
            <Link
              href="https://github.com/Suhaib3100/codetalk"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Contribute on GitHub
            </Link>
          </WhyPanel>
        ) : null}
      </div>
    </div>
  );
}

function WhyPanel(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'duration-700 animate-in fade-in slide-in-from-bottom-8',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
