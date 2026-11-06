"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export type SocialReel = {
  image: string;
  alt?: string;
  href?: string;
};

type Props = {
  items: readonly SocialReel[];
  children: ReactNode;
};

type State = {
  failed: boolean;
  resets: number;
};

/**
 * The gallery is the only subtree that may throw. Two automatic remounts, then
 * the six reel posters, so a WebGL failure cannot take the rest of the page.
 */
export default class SocialGalleryBoundary extends Component<Props, State> {
  state: State = { failed: false, resets: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    if (this.state.resets < 2) {
      this.setState(state => ({ failed: false, resets: state.resets + 1 }));
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="social-gallery social-gallery-fallback">
          {this.props.items.map(item => {
            const image = (
              // Posters are already saved locally; this row only appears after the gallery gives up.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.alt ?? ""} />
            );
            return item.href ? (
              <a key={item.image} href={item.href} target="_blank" rel="noopener noreferrer">
                {image}
              </a>
            ) : (
              <span key={item.image}>{image}</span>
            );
          })}
        </div>
      );
    }

    return <div key={this.state.resets}>{this.props.children}</div>;
  }
}
