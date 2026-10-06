import React, { useEffect, useRef } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          placement?: string;
          variant?: string;
          "avatar-image-url"?: string;
          "avatar-orb-color-1"?: string;
          "avatar-orb-color-2"?: string;
          [key: string]: any;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * Triggers the live telephony voice assistant modal
 */
export const launchIVRVoiceCall = () => {
  try {
    const el = document.querySelector("elevenlabs-convai") as HTMLElement;
    if (el) {
      el.setAttribute("data-active", "true");
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("pointer-events", "auto", "important");
    }
    document.dispatchEvent(
      new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "expand" },
      })
    );
  } catch (err) {
    console.error("Unable to launch IVR telephony assistant:", err);
  }
};

/**
 * Collapses the live telephony voice assistant
 */
export const closeIVRVoiceCall = () => {
  try {
    document.dispatchEvent(
      new CustomEvent("elevenlabs-agent:expand", {
        detail: { action: "collapse" },
      })
    );
    const el = document.querySelector("elevenlabs-convai") as HTMLElement;
    if (el) {
      el.removeAttribute("data-active");
      el.style.setProperty("display", "none", "important");
    }
  } catch (err) {
    console.error("Unable to collapse IVR telephony assistant:", err);
  }
};

export const ElevenLabsIVREmbed: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Ensure widget embed script is present
    const existingScript = document.querySelector(
      'script[src*="@elevenlabs/convai-widget-embed"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // 2. Hide branding in the shadow DOM tree
    const sanitizeRoot = (shadowRoot: ShadowRoot) => {
      if (!shadowRoot) return;

      // Inject strict styling rules into the shadow DOM
      if (!shadowRoot.querySelector("#pmajay-suppress-branding-css")) {
        const style = document.createElement("style");
        style.id = "pmajay-suppress-branding-css";
        style.textContent = `
          /* Strictly hide provider branding, links, and powered-by footers */
          a[href*="elevenlabs"],
          p:has(a[href*="elevenlabs"]),
          [class*="whitespace-nowrap"][class*="text-[10px]"],
          p.whitespace-nowrap,
          svg[aria-label*="ElevenLabs" i],
          [aria-label*="ElevenLabs" i],
          [aria-label*="Eleven" i] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
          }

          /* Government Portal Theme Touches */
          .rounded-sheet {
            border: 1.5px solid rgba(217, 119, 6, 0.45) !important;
            box-shadow: 0 20px 40px -10px rgba(0, 33, 71, 0.5) !important;
          }
        `;
        shadowRoot.appendChild(style);
      }

      // Traversal pass: hide anchors and text containing provider branding
      const anchors = shadowRoot.querySelectorAll('a[href*="elevenlabs"]');
      anchors.forEach((a) => {
        const parentP = a.closest("p");
        if (parentP) {
          parentP.style.setProperty("display", "none", "important");
          parentP.style.setProperty("visibility", "hidden", "important");
          parentP.style.setProperty("height", "0px", "important");
        }
        (a as HTMLElement).style.setProperty("display", "none", "important");
      });

      // Text node purge
      const treeWalker = document.createTreeWalker(
        shadowRoot,
        NodeFilter.SHOW_TEXT
      );
      const matchedNodes: Node[] = [];
      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        const val = node.nodeValue || "";
        if (
          val.includes("Powered by") ||
          val.includes("ElevenAgents") ||
          val.includes("ElevenLabs")
        ) {
          matchedNodes.push(node);
        }
      }

      matchedNodes.forEach((tn) => {
        const parent = tn.parentElement?.closest("p") || tn.parentElement;
        if (parent && parent !== shadowRoot) {
          parent.style.setProperty("display", "none", "important");
          parent.style.setProperty("visibility", "hidden", "important");
          parent.style.setProperty("height", "0px", "important");
        }
      });

      // Add national header disclaimer badge inside dialog card if missing
      const card = shadowRoot.querySelector(".rounded-sheet");
      if (card && !card.querySelector("#pmajay-national-ivr-bar")) {
        const badge = document.createElement("div");
        badge.id = "pmajay-national-ivr-bar";
        badge.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 10.5px;
          font-weight: 600;
          color: #f8fafc;
          background: #002147;
          border-top: 1px solid rgba(217, 119, 6, 0.4);
          letter-spacing: 0.02em;
          box-sizing: border-box;
          width: 100%;
          text-align: center;
        `;
        badge.innerHTML = `
          <span style="color: #f59e0b; font-size: 12px;">🇮🇳</span>
          <span>भारत सरकार • PM-AJAY GIA Telephony Assistant Demo (1800-11-2026)</span>
        `;
        card.appendChild(badge);
      }

      // Attach collapse click listener to conceal on close
      const closeButtons = shadowRoot.querySelectorAll(
        'button[aria-label*="Collapse" i], button[aria-label*="Close" i], button[aria-label*="go_back" i]'
      );
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          setTimeout(() => {
            const widget = document.querySelector("elevenlabs-convai") as HTMLElement;
            if (widget && !widget.getAttribute("data-keep-open")) {
              widget.style.setProperty("display", "none", "important");
              widget.removeAttribute("data-active");
            }
          }, 150);
        });
      });
    };

    // 3. Attach MutationObserver to custom element shadow root
    let pollInterval: any = null;
    let observer: MutationObserver | null = null;

    const attachToWidget = () => {
      const widget = document.querySelector("elevenlabs-convai") as HTMLElement;
      if (!widget) return false;

      // Keep hidden initially until requested by user action
      if (!widget.hasAttribute("data-active")) {
        widget.style.setProperty("display", "none", "important");
      }

      if (!widget.shadowRoot) return false;

      const sr = widget.shadowRoot;
      sanitizeRoot(sr);

      observer = new MutationObserver(() => {
        sanitizeRoot(sr);
      });
      observer.observe(sr, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return true;
    };

    if (!attachToWidget()) {
      pollInterval = setInterval(() => {
        if (attachToWidget()) {
          clearInterval(pollInterval);
        }
      }, 200);
    }

    // 4. Global custom event listener
    const handleOpenIVREvent = () => {
      launchIVRVoiceCall();
    };
    window.addEventListener("vikalp:open-ivr-voice", handleOpenIVREvent);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (observer) observer.disconnect();
      window.removeEventListener("vikalp:open-ivr-voice", handleOpenIVREvent);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pmajay-telephony-embed-wrapper pointer-events-none select-none"
      aria-label="PM-AJAY GIA Official Telephony Voice Demo"
    >
      {/* Official Government Conversational AI Web Component (initially hidden until user invokes) */}
      <elevenlabs-convai
        agent-id="agent_7901m4802g9ye4r9rx4kd1gznqkj"
        placement="bottom-right"
        avatar-orb-color-1="#002147"
        avatar-orb-color-2="#d97706"
        style={{ display: "none" }}
      />
    </div>
  );
};
