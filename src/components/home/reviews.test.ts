import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CustomerReviews } from "./HomePageContent";

describe("homepage review publication gate", () => {
  it("renders no section without approved content", () => {
    expect(
      renderToStaticMarkup(createElement(CustomerReviews, { reviews: [] })),
    ).toBe("");
    expect(
      renderToStaticMarkup(
        createElement(CustomerReviews, {
          reviews: [
            {
              quote: "TEST ONLY: unapproved",
              clientName: "Test fixture",
              approved: false,
            },
          ],
        }),
      ),
    ).toBe("");
  });
  it("excludes unapproved content and only offers navigation for multiple approved reviews", () => {
    const html = renderToStaticMarkup(
      createElement(CustomerReviews, {
        reviews: [
          {
            quote: "TEST ONLY: approved A",
            clientName: "Fixture A",
            approved: true,
          },
          {
            quote: "TEST ONLY: excluded",
            clientName: "Excluded fixture",
            approved: false,
          },
          {
            quote: "TEST ONLY: approved B",
            clientName: "Fixture B",
            approved: true,
          },
        ],
      }),
    );
    expect(html).toContain("TEST ONLY: approved A");
    expect(html).toContain("TEST ONLY: approved B");
    expect(html).not.toContain("Excluded fixture");
    expect(html).not.toContain("TEST ONLY: excluded");
    expect(html).toContain('aria-label="Next review"');
    expect(html).toContain('aria-hidden="true" inert=""');
  });
  it("switches to the marquee once there are enough approved reviews, with no duplicate rendered before hydration", () => {
    const reviews = ["A", "B", "C", "D"].map((label) => ({
      quote: `TEST ONLY: quote ${label}`,
      clientName: `Fixture ${label}`,
      approved: true,
    }));
    const html = renderToStaticMarkup(
      createElement(CustomerReviews, { reviews }),
    );
    // The initial (pre-hydration) render assumes a narrow viewport, so the
    // decorative duplicate row used for the seamless loop must not exist yet
    // — screen readers and no-JS clients only ever see one copy of each quote.
    for (const review of reviews) {
      const occurrences = html.split(review.quote).length - 1;
      expect(occurrences).toBe(1);
    }
    expect(html).not.toContain('aria-label="Next review"');
    expect(html).toContain('aria-label="Client reviews, 4 in total"');
  });
  it("keeps the paged carousel just below the marquee threshold", () => {
    const reviews = ["A", "B", "C"].map((label) => ({
      quote: `TEST ONLY: quote ${label}`,
      clientName: `Fixture ${label}`,
      approved: true,
    }));
    const html = renderToStaticMarkup(
      createElement(CustomerReviews, { reviews }),
    );
    expect(html).toContain('aria-label="Next review"');
  });
  it("only shows the sample-data flag when explicitly told it is sample data", () => {
    const reviews = [
      { quote: "TEST ONLY: approved", clientName: "Fixture", approved: true },
    ];
    const withoutFlag = renderToStaticMarkup(
      createElement(CustomerReviews, { reviews }),
    );
    expect(withoutFlag).not.toContain("Sample reviews");
    const withFlag = renderToStaticMarkup(
      createElement(CustomerReviews, { reviews, sampleMode: true }),
    );
    expect(withFlag).toContain("Sample reviews — for design preview only");
  });
});
