---
sidebar_position: 3
---

# Element

The source or target element can technically be any visible HTML or SVG element. That said, the most common elements are CANVAS, SVG, DIV, and IMG.

:::caution
If you do not provide a `cc` option with your `c2mChart` call, the "closed caption" (aka the screen reader text) is automatically added as a child to your target element.

Since an IMG element can't have children, if you use an IMG element, you must also provide a `cc` option. If you try to use an IMG element without providing a `cc` option, the `c2mChart` call will return an error message.
:::

The target element can be anything - the container of the visual chart, the visual chart itself, or even unrelated to the visual chart. For example, if you're a blind programmer who doesn't want to generate any visuals at all, you can just reference an empty element on the page.

For screen reader users, the target element will be a "tab stop" that the user can navigate to. It will be the user's point of reference for the interactions on the page. In order to optimize the element for screen reader users, some attributes are added to the element:

1. Label. If you, the report author, didn't add any labels to the element, C2M will add them for you. However, if you want to control what that label is, you can simply add labels using `alt=` or `aria-label=`. C2M will not add a custom label if there is already an `alt` or `aria-label` attribute on the element.
2. Role. By default, C2M assigns the element the role of "application". This will help communicate to screen readers and screen reader users that the element is interactive. However, C2M will not overwrite assigned roles. If you want the role to be something else, you can assign it directly, and C2M will respect that.

## Roles

C2M uses the `application` role by default. In broad strokes, this role indicates that the element is interactive. Currently, an element can only have one role; different roles come with different benefits, so you may choose to override the default role.

The benefit of using `role=application` helps streamline the interactive process. In order for a Windows-based screen reader user to interact with a c2m chart, they must enter "focus mode" / "forms mode". For a normal element, a user must know to enter this mode; with role=application, the mode is entered automatically. This creates an improved user experience for the user, once they arrive at the element.

:::note
To learn more about the application role, see [the MDN article on role=application](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/application_role), or [the WAI-ARIA spec on the application role](https://www.w3.org/TR/wai-aria-1.0/roles#application).
:::

An alternative choice of role is `role=img`. This helps indicate to a user that this is an image, since the chart itself is visual. Screen reader users can browse or navigate specifically to the images on the page, so flagging your element as an image will include it in that list. Since C2M automatically adds a label indicating that the element is a "sonified chart", hopefully that label will cue the user to enter focus mode / forms mode, so that they can interact with the chart. The `img` role creates an improved experience for users to find the element.

If you would prefer your target element to have an `img` role, rather than the default `application` role, you can include that role with your target element. If your element is an IMG element, you would still need to include the role, such as in this example:

```
<img role="img" src="MyImage.png" />
```

