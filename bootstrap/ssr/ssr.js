import { mergeProps, useSSRContext, ref, watch, onMounted, computed, onBeforeUnmount, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, withModifiers, vModelCheckbox, Teleport, createSSRApp, h } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrRenderTeleport, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { usePage, Link, Head, router, useForm, createInertiaApp } from "@inertiajs/vue3";
import debounce from "lodash-es/debounce.js";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const _sfc_main$s = {
  __name: "DarkModeToggle",
  __ssrInlineRender: true,
  props: {
    isDark: Boolean
  },
  emits: ["toggle"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        "aria-label": __props.isDark ? "Switch to light mode" : "Switch to dark mode"
      }, _attrs))}>`);
      if (__props.isDark) {
        _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`);
      } else {
        _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
      }
      _push(`</button>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DarkModeToggle.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
function useDarkMode() {
  const isDark = ref(false);
  const toggle = () => {
    isDark.value = !isDark.value;
  };
  const setDarkMode = (value) => {
    isDark.value = value;
  };
  watch(isDark, (value) => {
    localStorage.setItem("darkMode", value ? "dark" : "light");
    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
  onMounted(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) {
      isDark.value = stored === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });
  return { isDark, toggle, setDarkMode };
}
const _sfc_main$r = {
  __name: "AppLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const { isDark, toggle } = useDarkMode();
    computed(() => isDark.value ? "/logo-focusfolio-dark.svg" : "/logo-focusfolio.svg");
    const showNotifications = ref(false);
    const notificationsPanel = ref(null);
    const notifications = computed(() => page.props.notifications || { unread_count: 0, items: [] });
    const closeNotifications = () => {
      showNotifications.value = false;
    };
    const showUserMenu = ref(false);
    const userMenuPanel = ref(null);
    const closeUserMenu = () => {
      showUserMenu.value = false;
    };
    const handleClickOutside = (event) => {
      const clickedNotifications = notificationsPanel.value?.contains(event.target);
      const clickedUserMenu = userMenuPanel.value?.contains(event.target);
      if (!clickedNotifications) {
        closeNotifications();
      }
      if (!clickedUserMenu) {
        closeUserMenu();
      }
    };
    const formatDateTime = (value) => {
      if (!value) {
        return "";
      }
      return new Date(value).toLocaleString();
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" }, _attrs))}>`);
      if (unref(page).props.impersonation) {
        _push(`<div class="bg-amber-500 text-white text-sm px-4 py-2 flex items-center justify-between"><div class="flex items-center gap-2"><span class="font-semibold">Impersonating</span><span>${ssrInterpolate(unref(page).props.auth?.user?.name)}</span></div><button type="button" class="underline font-semibold"> Stop </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<nav class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between h-16"><div class="flex items-center">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="font-bold text-xl dark:text-gray-400"${_scopeId}>PPD</p><p class="text-xs dark:text-gray-300"${_scopeId}>Professional Photographer Directory</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("p", { class: "font-bold text-xl dark:text-gray-400" }, "PPD"),
                createVNode("p", { class: "text-xs dark:text-gray-300" }, "Professional Photographer Directory")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_sfc_main$s, {
        "is-dark": unref(isDark),
        onToggle: unref(toggle)
      }, null, _parent));
      if (unref(page).props.auth?.user) {
        _push(`<!--[--><div class="relative"><button type="button" class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Notifications"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`);
        if (notifications.value.unread_count > 0) {
          _push(`<span class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none rounded-full bg-primary-500 text-white">${ssrInterpolate(notifications.value.unread_count)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
        if (showNotifications.value) {
          _push(`<div class="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-40"><div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"><div><p class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p><p class="text-xs text-gray-500 dark:text-gray-400">${ssrInterpolate(notifications.value.unread_count)} unread </p></div>`);
          if (notifications.value.unread_count > 0) {
            _push(`<button type="button" class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"> Mark all read </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (notifications.value.items.length === 0) {
            _push(`<div class="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm"> No notifications yet. </div>`);
          } else {
            _push(`<div class="divide-y divide-gray-100 dark:divide-gray-700"><!--[-->`);
            ssrRenderList(notifications.value.items, (item) => {
              _push(`<div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"><div class="flex items-start gap-3"><div class="mt-0.5"><span class="${ssrRenderClass([item.read_at ? "bg-gray-300 dark:bg-gray-500" : "bg-primary-500", "inline-flex h-2 w-2 rounded-full"])}"></span></div><div class="flex-1 min-w-0"><p class="text-sm font-semibold text-gray-900 dark:text-white">${ssrInterpolate(item.data?.from_name || "New message")}</p><p class="text-sm text-gray-600 dark:text-gray-300">${ssrInterpolate(item.data?.listing_name || "Listing update")}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">${ssrInterpolate(item.data?.message)}</p><p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">${ssrInterpolate(formatDateTime(item.created_at))}</p></div>`);
              if (!item.read_at) {
                _push(`<button type="button" class="text-xs text-primary-600 dark:text-primary-400 hover:underline"> Mark read </button>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`<div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-right">`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/notifications",
            class: "text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline",
            onClick: closeNotifications
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View all `);
              } else {
                return [
                  createTextVNode(" View all ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="relative"><button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><span class="text-sm font-semibold truncate max-w-[140px]">${ssrInterpolate(unref(page).props.auth.user.name)}</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
        if (showUserMenu.value) {
          _push(`<div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-40"><div class="py-1">`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/dashboard",
            class: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Dashboard `);
              } else {
                return [
                  createTextVNode(" Dashboard ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(page).props.auth.user.is_admin) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin/verification",
              class: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
              onClick: closeUserMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Verification `);
                } else {
                  return [
                    createTextVNode(" Verification ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(page).props.auth.user.is_admin) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin/flags",
              class: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
              onClick: closeUserMenu
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Flags `);
                } else {
                  return [
                    createTextVNode(" Flags ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(unref(Link), {
            href: "/logout",
            method: "post",
            as: "button",
            class: "w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Logout `);
              } else {
                return [
                  createTextVNode(" Logout ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/login",
          class: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Login `);
            } else {
              return [
                createTextVNode(" Login ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/register",
          class: "bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Register `);
            } else {
              return [
                createTextVNode(" Register ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></div></nav><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AppLayout.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    flags: Object,
    filters: Object,
    statuses: Array
  },
  setup(__props) {
    const notes = ref({});
    const updateStatus = (flagId, action) => {
      router.post(`/admin/flags/${flagId}/${action}`, {
        admin_notes: notes.value[flagId] || ""
      }, {
        preserveScroll: true
      });
    };
    const changeStatusFilter = (status) => {
      router.get("/admin/flags", { status }, {
        preserveState: true,
        replace: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Flagged Listings" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-8"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Moderation</p><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Flagged Listings</h1></div><div class="flex items-center gap-3"${_scopeId}><select${ssrRenderAttr("value", __props.filters.status)} class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"${_scopeId}><!--[-->`);
            ssrRenderList(__props.statuses, (status) => {
              _push2(`<option${ssrRenderAttr("value", status)}${_scopeId}>${ssrInterpolate(status)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"${_scopeId}><table class="w-full"${_scopeId}><thead class="bg-gray-100 dark:bg-gray-800/70"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Listing</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Reporter</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Reason</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Notes</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
            ssrRenderList(__props.flags.data, (flag) => {
              _push2(`<tr class="bg-white dark:bg-gray-900"${_scopeId}><td class="px-4 py-3"${_scopeId}><div class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/listings/${flag.listing.id}`,
                class: "hover:text-primary-500"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(flag.listing.company_name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(flag.listing.company_name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><div class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Status: ${ssrInterpolate(flag.status)}</div></td><td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200"${_scopeId}>`);
              if (flag.reporter) {
                _push2(`<div${_scopeId}>${ssrInterpolate(flag.reporter.name)} <span class="text-xs text-gray-500 dark:text-gray-400 block"${_scopeId}>${ssrInterpolate(flag.reporter.email)}</span></div>`);
              } else {
                _push2(`<div class="text-gray-500 dark:text-gray-400 text-sm"${_scopeId}>Unknown</div>`);
              }
              _push2(`</td><td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 max-w-xs"${_scopeId}>${ssrInterpolate(flag.reason)}</td><td class="px-4 py-3"${_scopeId}><textarea rows="2" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${ssrRenderAttr("placeholder", flag.admin_notes || "Add note")}${_scopeId}>${ssrInterpolate(notes.value[flag.id])}</textarea></td><td class="px-4 py-3 text-right"${_scopeId}><div class="flex flex-col sm:flex-row gap-2 justify-end"${_scopeId}><button class="px-3 py-1.5 text-sm font-semibold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 hover:bg-emerald-200"${_scopeId}> Resolve </button><button class="px-3 py-1.5 text-sm font-semibold rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200"${_scopeId}> Reject </button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.flags.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"${_scopeId}> No flags found for this filter. </td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.flags.links?.length) {
              _push2(`<div class="mt-4 flex flex-wrap gap-2 justify-center"${_scopeId}><!--[-->`);
              ssrRenderList(__props.flags.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  "preserve-scroll": "",
                  class: [
                    "px-3 py-2 rounded-lg text-sm",
                    link.active ? "bg-primary-500 text-white" : link.url ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  ]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-8" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Moderation"),
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Flagged Listings")
                  ]),
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("select", {
                      value: __props.filters.status,
                      onChange: ($event) => changeStatusFilter($event.target.value),
                      class: "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.statuses, (status) => {
                        return openBlock(), createBlock("option", {
                          key: status,
                          value: status
                        }, toDisplayString(status), 9, ["value"]);
                      }), 128))
                    ], 40, ["value", "onChange"])
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden" }, [
                  createVNode("table", { class: "w-full" }, [
                    createVNode("thead", { class: "bg-gray-100 dark:bg-gray-800/70" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Listing"),
                        createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Reporter"),
                        createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Reason"),
                        createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Notes"),
                        createVNode("th", { class: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Actions")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.flags.data, (flag) => {
                        return openBlock(), createBlock("tr", {
                          key: flag.id,
                          class: "bg-white dark:bg-gray-900"
                        }, [
                          createVNode("td", { class: "px-4 py-3" }, [
                            createVNode("div", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, [
                              createVNode(unref(Link), {
                                href: `/listings/${flag.listing.id}`,
                                class: "hover:text-primary-500"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(flag.listing.company_name), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Status: " + toDisplayString(flag.status), 1)
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-sm text-gray-700 dark:text-gray-200" }, [
                            flag.reporter ? (openBlock(), createBlock("div", { key: 0 }, [
                              createTextVNode(toDisplayString(flag.reporter.name) + " ", 1),
                              createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400 block" }, toDisplayString(flag.reporter.email), 1)
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "text-gray-500 dark:text-gray-400 text-sm"
                            }, "Unknown"))
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-sm text-gray-700 dark:text-gray-200 max-w-xs" }, toDisplayString(flag.reason), 1),
                          createVNode("td", { class: "px-4 py-3" }, [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => notes.value[flag.id] = $event,
                              rows: "2",
                              class: "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500",
                              placeholder: flag.admin_notes || "Add note"
                            }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                              [vModelText, notes.value[flag.id]]
                            ])
                          ]),
                          createVNode("td", { class: "px-4 py-3 text-right" }, [
                            createVNode("div", { class: "flex flex-col sm:flex-row gap-2 justify-end" }, [
                              createVNode("button", {
                                class: "px-3 py-1.5 text-sm font-semibold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 hover:bg-emerald-200",
                                onClick: ($event) => updateStatus(flag.id, "resolve")
                              }, " Resolve ", 8, ["onClick"]),
                              createVNode("button", {
                                class: "px-3 py-1.5 text-sm font-semibold rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200",
                                onClick: ($event) => updateStatus(flag.id, "reject")
                              }, " Reject ", 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128)),
                      __props.flags.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "5",
                          class: "px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                        }, " No flags found for this filter. ")
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                __props.flags.links?.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-4 flex flex-wrap gap-2 justify-center"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.flags.links, (link) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: link.label,
                      href: link.url || "#",
                      "preserve-scroll": "",
                      class: [
                        "px-3 py-2 rounded-lg text-sm",
                        link.active ? "bg-primary-500 text-white" : link.url ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      ],
                      innerHTML: link.label
                    }, null, 8, ["href", "class", "innerHTML"]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Flags/Index.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$q
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$p = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    requests: Object,
    filters: Object
  },
  setup(__props) {
    const changeStatus = (status) => {
      router.get("/admin/verification", { status }, { preserveState: true, preserveScroll: true });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"${_scopeId}><div class="flex items-start justify-between gap-3 mb-4"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"${_scopeId}>Admin</p><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Verification Requests</h1></div><div class="flex gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(["pending", "in_review", "approved", "rejected"], (option) => {
              _push2(`<button class="${ssrRenderClass([__props.filters.status === option ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700", "px-3 py-1.5 rounded-lg text-sm font-medium border"])}"${_scopeId}>${ssrInterpolate(option.replace("_", " "))}</button>`);
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/admin/verification/export?status=${__props.filters.status}`,
              class: "px-3 py-1.5 rounded-lg text-sm font-medium border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Export CSV `);
                } else {
                  return [
                    createTextVNode(" Export CSV ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-900/70"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200"${_scopeId}>Business</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200"${_scopeId}>Owner</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200"${_scopeId}>Status</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200"${_scopeId}>Submitted</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200"${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"${_scopeId}><!--[-->`);
            ssrRenderList(__props.requests.data, (req) => {
              _push2(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"${_scopeId}><td class="px-4 py-3"${_scopeId}><div class="font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(req.business_name)}</div><div class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(req.user?.name)} (${ssrInterpolate(req.user?.email)})</div></td><td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200"${_scopeId}><div class="font-medium"${_scopeId}>${ssrInterpolate(req.owner_name)}</div><div class="text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(req.owner_email)}</div></td><td class="px-4 py-3"${_scopeId}><span class="${ssrRenderClass([{
                "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200": req.status === "pending" || req.status === "in_review",
                "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200": req.status === "approved",
                "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200": req.status === "rejected"
              }, "px-3 py-1 rounded-full text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(req.status.replace("_", " "))}</span></td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"${_scopeId}>${ssrInterpolate(req.submitted_at ? new Date(req.submitted_at).toLocaleString() : "—")}</td><td class="px-4 py-3 text-right"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/verification/${req.id}`,
                class: "px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Review `);
                  } else {
                    return [
                      createTextVNode(" Review ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (__props.requests.links?.length) {
              _push2(`<div class="px-4 py-3 flex flex-wrap gap-2 justify-center border-t border-gray-200 dark:border-gray-800"${_scopeId}><!--[-->`);
              ssrRenderList(__props.requests.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  class: ["px-3 py-1.5 text-sm rounded-lg border", link.active ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" }, [
                createVNode("div", { class: "flex items-start justify-between gap-3 mb-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400" }, "Admin"),
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Verification Requests")
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(["pending", "in_review", "approved", "rejected"], (option) => {
                      return createVNode("button", {
                        key: option,
                        onClick: ($event) => changeStatus(option),
                        class: ["px-3 py-1.5 rounded-lg text-sm font-medium border", __props.filters.status === option ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"]
                      }, toDisplayString(option.replace("_", " ")), 11, ["onClick"]);
                    }), 64)),
                    createVNode(unref(Link), {
                      href: `/admin/verification/export?status=${__props.filters.status}`,
                      class: "px-3 py-1.5 rounded-lg text-sm font-medium border bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Export CSV ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "min-w-full divide-y divide-gray-200 dark:divide-gray-800" }, [
                      createVNode("thead", { class: "bg-gray-50 dark:bg-gray-900/70" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200" }, "Business"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200" }, "Owner"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200" }, "Status"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200" }, "Submitted"),
                          createVNode("th", { class: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200" }, "Actions")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.requests.data, (req) => {
                          return openBlock(), createBlock("tr", {
                            key: req.id,
                            class: "hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                          }, [
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("div", { class: "font-semibold text-gray-900 dark:text-white" }, toDisplayString(req.business_name), 1),
                              createVNode("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, toDisplayString(req.user?.name) + " (" + toDisplayString(req.user?.email) + ")", 1)
                            ]),
                            createVNode("td", { class: "px-4 py-3 text-sm text-gray-700 dark:text-gray-200" }, [
                              createVNode("div", { class: "font-medium" }, toDisplayString(req.owner_name), 1),
                              createVNode("div", { class: "text-gray-500 dark:text-gray-400" }, toDisplayString(req.owner_email), 1)
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("span", {
                                class: ["px-3 py-1 rounded-full text-xs font-semibold", {
                                  "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200": req.status === "pending" || req.status === "in_review",
                                  "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200": req.status === "approved",
                                  "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200": req.status === "rejected"
                                }]
                              }, toDisplayString(req.status.replace("_", " ")), 3)
                            ]),
                            createVNode("td", { class: "px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap" }, toDisplayString(req.submitted_at ? new Date(req.submitted_at).toLocaleString() : "—"), 1),
                            createVNode("td", { class: "px-4 py-3 text-right" }, [
                              createVNode(unref(Link), {
                                href: `/admin/verification/${req.id}`,
                                class: "px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Review ")
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  __props.requests.links?.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-4 py-3 flex flex-wrap gap-2 justify-center border-t border-gray-200 dark:border-gray-800"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.requests.links, (link) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: link.label,
                        href: link.url || "#",
                        innerHTML: link.label,
                        class: ["px-3 py-1.5 text-sm rounded-lg border", link.active ? "bg-primary-600 text-white border-primary-600" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"]
                      }, null, 8, ["href", "innerHTML", "class"]);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Verification/Index.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$p
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$o = {
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Are you sure?"
    },
    message: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: "Confirm"
    },
    cancelText: {
      type: String,
      default: "Cancel"
    },
    danger: {
      type: Boolean,
      default: true
    }
  },
  emits: ["confirm", "cancel", "update:show"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = computed({
      get: () => props.show,
      set: (value) => emit("update:show", value)
    });
    const close = () => {
      visible.value = false;
      emit("cancel");
    };
    const onKeydown = (event) => {
      if (event.key === "Escape" && visible.value) {
        close();
      }
    };
    watch(() => props.show, (value) => {
      if (value) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    });
    onMounted(() => window.addEventListener("keydown", onKeydown));
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", onKeydown);
      document.body.classList.remove("overflow-hidden");
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (visible.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4"><div><h3 class="text-lg font-semibold text-gray-900 dark:text-white">${ssrInterpolate(__props.title)}</h3>`);
          if (__props.message) {
            _push2(`<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">${ssrInterpolate(__props.message)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex items-center justify-end gap-3"><button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">${ssrInterpolate(__props.cancelText)}</button><button type="button" class="${ssrRenderClass([__props.danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-primary-600 text-white hover:bg-primary-700", "px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors"])}">${ssrInterpolate(__props.confirmText)}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ConfirmDialog.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    request: Object
  },
  setup(__props) {
    const props = __props;
    const showApprove = ref(false);
    const showReject = ref(false);
    const adminNotes = ref(props.request.admin_notes || "");
    const approve = () => {
      router.post(`/admin/verification/${props.request.id}/approve`, { admin_notes: adminNotes.value }, {
        preserveScroll: true
      });
      showApprove.value = false;
    };
    const reject = () => {
      router.post(`/admin/verification/${props.request.id}/reject`, { admin_notes: adminNotes.value }, {
        preserveScroll: true
      });
      showReject.value = false;
    };
    const impersonateUser = () => {
      router.post(`/admin/impersonate/${props.request.user.id}`, {}, {
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"${_scopeId}>Admin</p><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Review verification</h1><p class="text-gray-600 dark:text-gray-300"${_scopeId}>Request #${ssrInterpolate(__props.request.id)}</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/verification",
              class: "text-sm text-primary-600 dark:text-primary-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to list`);
                } else {
                  return [
                    createTextVNode("Back to list")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="${ssrRenderClass([{
              "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200": __props.request.status === "pending" || __props.request.status === "in_review",
              "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200": __props.request.status === "approved",
              "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200": __props.request.status === "rejected"
            }, "px-3 py-1 rounded-full text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate(__props.request.status.replace("_", " "))}</span><span class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}> Submitted ${ssrInterpolate(__props.request.submitted_at ? new Date(__props.request.submitted_at).toLocaleString() : "—")}</span></div><div class="grid md:grid-cols-2 gap-6"${_scopeId}><div class="space-y-4"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Business</h2><div class="space-y-2 text-gray-700 dark:text-gray-200"${_scopeId}><div${_scopeId}><span class="font-semibold"${_scopeId}>Name:</span> ${ssrInterpolate(__props.request.business_name)}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Entity:</span> ${ssrInterpolate(__props.request.legal_entity_type || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Registration #:</span> ${ssrInterpolate(__props.request.registration_number || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>State:</span> ${ssrInterpolate(__props.request.registration_state || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Address:</span> ${ssrInterpolate(__props.request.business_address || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Website:</span>`);
            if (__props.request.website) {
              _push2(`<a${ssrRenderAttr("href", __props.request.website)} target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline"${_scopeId}>${ssrInterpolate(__props.request.website)}</a>`);
            } else {
              _push2(`<span${_scopeId}>—</span>`);
            }
            _push2(`</div><div${_scopeId}><span class="font-semibold"${_scopeId}>BBB:</span>`);
            if (__props.request.bbb_profile_url) {
              _push2(`<a${ssrRenderAttr("href", __props.request.bbb_profile_url)} target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline"${_scopeId}>${ssrInterpolate(__props.request.bbb_profile_url)}</a>`);
            } else {
              _push2(`<span${_scopeId}>—</span>`);
            }
            _push2(`</div></div></div><div class="space-y-4"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Owner</h2><div class="space-y-2 text-gray-700 dark:text-gray-200"${_scopeId}><div${_scopeId}><span class="font-semibold"${_scopeId}>Name:</span> ${ssrInterpolate(__props.request.owner_name)}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Email:</span> ${ssrInterpolate(__props.request.owner_email)}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Phone:</span> ${ssrInterpolate(__props.request.owner_phone || "—")}</div><div class="pt-2 border-t border-gray-200 dark:border-gray-800"${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>User</p><p class="text-sm text-gray-800 dark:text-gray-200"${_scopeId}>${ssrInterpolate(__props.request.user.name)} (${ssrInterpolate(__props.request.user.email)}) — status: ${ssrInterpolate(__props.request.user.verification_status)}</p><button type="button" class="mt-2 inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700"${_scopeId}> Impersonate user </button></div></div></div></div><div class="space-y-3"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Admin notes</label><textarea rows="3" class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>${ssrInterpolate(adminNotes.value)}</textarea></div><div class="flex flex-wrap gap-3 justify-end"${_scopeId}><button type="button" class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"${_scopeId}> Reject </button><button type="button" class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"${_scopeId}> Approve </button></div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: showApprove.value,
              title: "Approve verification?",
              message: `Mark ${__props.request.business_name} as verified and badge their listings.`,
              "confirm-text": "Approve",
              "cancel-text": "Cancel",
              danger: false,
              "onUpdate:show": ($event) => showApprove.value = $event,
              onConfirm: approve
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: showReject.value,
              title: "Reject verification?",
              message: `Reject ${__props.request.business_name}. Their listings will be hidden until re-approved.`,
              "confirm-text": "Reject",
              "cancel-text": "Cancel",
              "onUpdate:show": ($event) => showReject.value = $event,
              onConfirm: reject
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6" }, [
                createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400" }, "Admin"),
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Review verification"),
                    createVNode("p", { class: "text-gray-600 dark:text-gray-300" }, "Request #" + toDisplayString(__props.request.id), 1)
                  ]),
                  createVNode(unref(Link), {
                    href: "/admin/verification",
                    class: "text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to list")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6" }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("span", {
                      class: ["px-3 py-1 rounded-full text-xs font-semibold", {
                        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200": __props.request.status === "pending" || __props.request.status === "in_review",
                        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200": __props.request.status === "approved",
                        "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200": __props.request.status === "rejected"
                      }]
                    }, toDisplayString(__props.request.status.replace("_", " ")), 3),
                    createVNode("span", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Submitted " + toDisplayString(__props.request.submitted_at ? new Date(__props.request.submitted_at).toLocaleString() : "—"), 1)
                  ]),
                  createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Business"),
                      createVNode("div", { class: "space-y-2 text-gray-700 dark:text-gray-200" }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Name:"),
                          createTextVNode(" " + toDisplayString(__props.request.business_name), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Entity:"),
                          createTextVNode(" " + toDisplayString(__props.request.legal_entity_type || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Registration #:"),
                          createTextVNode(" " + toDisplayString(__props.request.registration_number || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "State:"),
                          createTextVNode(" " + toDisplayString(__props.request.registration_state || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Address:"),
                          createTextVNode(" " + toDisplayString(__props.request.business_address || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Website:"),
                          __props.request.website ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: __props.request.website,
                            target: "_blank",
                            class: "text-primary-600 dark:text-primary-400 hover:underline"
                          }, toDisplayString(__props.request.website), 9, ["href"])) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "BBB:"),
                          __props.request.bbb_profile_url ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: __props.request.bbb_profile_url,
                            target: "_blank",
                            class: "text-primary-600 dark:text-primary-400 hover:underline"
                          }, toDisplayString(__props.request.bbb_profile_url), 9, ["href"])) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Owner"),
                      createVNode("div", { class: "space-y-2 text-gray-700 dark:text-gray-200" }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Name:"),
                          createTextVNode(" " + toDisplayString(__props.request.owner_name), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Email:"),
                          createTextVNode(" " + toDisplayString(__props.request.owner_email), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Phone:"),
                          createTextVNode(" " + toDisplayString(__props.request.owner_phone || "—"), 1)
                        ]),
                        createVNode("div", { class: "pt-2 border-t border-gray-200 dark:border-gray-800" }, [
                          createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "User"),
                          createVNode("p", { class: "text-sm text-gray-800 dark:text-gray-200" }, toDisplayString(__props.request.user.name) + " (" + toDisplayString(__props.request.user.email) + ") — status: " + toDisplayString(__props.request.user.verification_status), 1),
                          createVNode("button", {
                            type: "button",
                            class: "mt-2 inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700",
                            onClick: impersonateUser
                          }, " Impersonate user ")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Admin notes"),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => adminNotes.value = $event,
                      rows: "3",
                      class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, adminNotes.value]
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-wrap gap-3 justify-end" }, [
                    createVNode("button", {
                      type: "button",
                      class: "px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700",
                      onClick: ($event) => showReject.value = true
                    }, " Reject ", 8, ["onClick"]),
                    createVNode("button", {
                      type: "button",
                      class: "px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700",
                      onClick: ($event) => showApprove.value = true
                    }, " Approve ", 8, ["onClick"])
                  ])
                ])
              ]),
              createVNode(_sfc_main$o, {
                show: showApprove.value,
                title: "Approve verification?",
                message: `Mark ${__props.request.business_name} as verified and badge their listings.`,
                "confirm-text": "Approve",
                "cancel-text": "Cancel",
                danger: false,
                "onUpdate:show": ($event) => showApprove.value = $event,
                onConfirm: approve
              }, null, 8, ["show", "message", "onUpdate:show"]),
              createVNode(_sfc_main$o, {
                show: showReject.value,
                title: "Reject verification?",
                message: `Reject ${__props.request.business_name}. Their listings will be hidden until re-approved.`,
                "confirm-text": "Reject",
                "cancel-text": "Cancel",
                "onUpdate:show": ($event) => showReject.value = $event,
                onConfirm: reject
              }, null, 8, ["show", "message", "onUpdate:show"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Verification/Show.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    const submit = () => {
      form.post("/login", {
        onFinish: () => form.reset("password")
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden py-12"${_scopeId}><div class="absolute inset-0 opacity-20"${_scopeId}><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", "background-size": "40px 40px" })}"${_scopeId}></div></div><div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="relative w-full max-w-md mx-auto px-4"${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transition-colors"${_scopeId}><div class="text-center mb-8"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Welcome Back</h1><p class="text-gray-600 dark:text-gray-400 mt-2"${_scopeId}>Sign in to your account</p></div><form class="space-y-5"${_scopeId}><div${_scopeId}><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Email </label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required autofocus class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Enter your email"${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<p class="mt-1.5 text-sm text-red-500 dark:text-red-400"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Password </label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Enter your password"${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<p class="mt-1.5 text-sm text-red-500 dark:text-red-400"${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center"${_scopeId}><input id="remember"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"${_scopeId}><label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300"${_scopeId}> Remember me </label></div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Signing in...</span>`);
            } else {
              _push2(`<span${_scopeId}>Sign In</span>`);
            }
            _push2(`</button></form><p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Don&#39;t have an account? `);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/register",
              class: "text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create one `);
                } else {
                  return [
                    createTextVNode(" Create one ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div></div></section>`);
          } else {
            return [
              createVNode("section", { class: "relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden py-12" }, [
                createVNode("div", { class: "absolute inset-0 opacity-20" }, [
                  createVNode("div", {
                    class: "absolute inset-0",
                    style: { "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", "background-size": "40px 40px" }
                  })
                ]),
                createVNode("div", { class: "absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "relative w-full max-w-md mx-auto px-4" }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transition-colors" }, [
                    createVNode("div", { class: "text-center mb-8" }, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Welcome Back"),
                      createVNode("p", { class: "text-gray-600 dark:text-gray-400 mt-2" }, "Sign in to your account")
                    ]),
                    createVNode("form", {
                      onSubmit: withModifiers(submit, ["prevent"]),
                      class: "space-y-5"
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "email",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Email "),
                        withDirectives(createVNode("input", {
                          id: "email",
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          required: "",
                          autofocus: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Enter your email"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).email]
                        ]),
                        unref(form).errors.email ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-sm text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "password",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Password "),
                        withDirectives(createVNode("input", {
                          id: "password",
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          required: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Enter your password"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).password]
                        ]),
                        unref(form).errors.password ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-sm text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          id: "remember",
                          "onUpdate:modelValue": ($event) => unref(form).remember = $event,
                          type: "checkbox",
                          class: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).remember]
                        ]),
                        createVNode("label", {
                          for: "remember",
                          class: "ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        }, " Remember me ")
                      ]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Signing in...")) : (openBlock(), createBlock("span", { key: 1 }, "Sign In"))
                      ], 8, ["disabled"])
                    ], 32),
                    createVNode("p", { class: "mt-6 text-center text-sm text-gray-600 dark:text-gray-400" }, [
                      createTextVNode(" Don't have an account? "),
                      createVNode(unref(Link), {
                        href: "/register",
                        class: "text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Create one ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    const submit = () => {
      form.post("/register", {
        onFinish: () => form.reset("password", "password_confirmation")
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden py-12"${_scopeId}><div class="absolute inset-0 opacity-20"${_scopeId}><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", "background-size": "40px 40px" })}"${_scopeId}></div></div><div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="relative w-full max-w-md mx-auto px-4"${_scopeId}><div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transition-colors"${_scopeId}><div class="text-center mb-8"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Create Account</h1><p class="text-gray-600 dark:text-gray-400 mt-2"${_scopeId}>Join our photography community</p></div><form class="space-y-5"${_scopeId}><div${_scopeId}><label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Name </label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" required autofocus class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Enter your name"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="mt-1.5 text-sm text-red-500 dark:text-red-400"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Email </label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Enter your email"${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<p class="mt-1.5 text-sm text-red-500 dark:text-red-400"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Password </label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Create a password"${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<p class="mt-1.5 text-sm text-red-500 dark:text-red-400"${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"${_scopeId}> Confirm Password </label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Confirm your password"${_scopeId}></div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Creating account...</span>`);
            } else {
              _push2(`<span${_scopeId}>Create Account</span>`);
            }
            _push2(`</button></form><p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Already have an account? `);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/login",
              class: "text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign In `);
                } else {
                  return [
                    createTextVNode(" Sign In ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div></div></section>`);
          } else {
            return [
              createVNode("section", { class: "relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden py-12" }, [
                createVNode("div", { class: "absolute inset-0 opacity-20" }, [
                  createVNode("div", {
                    class: "absolute inset-0",
                    style: { "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", "background-size": "40px 40px" }
                  })
                ]),
                createVNode("div", { class: "absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "relative w-full max-w-md mx-auto px-4" }, [
                  createVNode("div", { class: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transition-colors" }, [
                    createVNode("div", { class: "text-center mb-8" }, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Create Account"),
                      createVNode("p", { class: "text-gray-600 dark:text-gray-400 mt-2" }, "Join our photography community")
                    ]),
                    createVNode("form", {
                      onSubmit: withModifiers(submit, ["prevent"]),
                      class: "space-y-5"
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "name",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Name "),
                        withDirectives(createVNode("input", {
                          id: "name",
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          type: "text",
                          required: "",
                          autofocus: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Enter your name"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).name]
                        ]),
                        unref(form).errors.name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-sm text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "email",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Email "),
                        withDirectives(createVNode("input", {
                          id: "email",
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          required: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Enter your email"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).email]
                        ]),
                        unref(form).errors.email ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-sm text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "password",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Password "),
                        withDirectives(createVNode("input", {
                          id: "password",
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          required: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Create a password"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).password]
                        ]),
                        unref(form).errors.password ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1.5 text-sm text-red-500 dark:text-red-400"
                        }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "password_confirmation",
                          class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        }, " Confirm Password "),
                        withDirectives(createVNode("input", {
                          id: "password_confirmation",
                          "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                          type: "password",
                          required: "",
                          class: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
                          placeholder: "Confirm your password"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).password_confirmation]
                        ])
                      ]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Creating account...")) : (openBlock(), createBlock("span", { key: 1 }, "Create Account"))
                      ], 8, ["disabled"])
                    ], 32),
                    createVNode("p", { class: "mt-6 text-center text-sm text-gray-600 dark:text-gray-400" }, [
                      createTextVNode(" Already have an account? "),
                      createVNode(unref(Link), {
                        href: "/login",
                        class: "text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Sign In ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = {
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    buttonText: String,
    buttonHref: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-12" }, _attrs))}><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><h3 class="mt-2 text-lg font-medium text-gray-900">${ssrInterpolate(__props.title)}</h3><p class="mt-1 text-gray-500">${ssrInterpolate(__props.description)}</p><div class="mt-6">`);
      _push(ssrRenderComponent(unref(Link), {
        href: __props.buttonHref,
        class: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.buttonText)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.buttonText), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/EmptyState.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    listings: Array,
    filters: Object,
    analytics: Object
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const search = ref(props.filters?.search || "");
    let searchTimeout = null;
    watch(search, (value) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        router.get("/dashboard", { search: value || void 0 }, {
          preserveState: true,
          preserveScroll: true
        });
      }, 300);
    });
    const pendingDelete = ref(null);
    const promptDelete = (listing) => {
      pendingDelete.value = listing;
    };
    const deleteListing = () => {
      if (!pendingDelete.value) {
        return;
      }
      router.delete(`/listings/${pendingDelete.value.id}`, {
        onFinish: () => {
          pendingDelete.value = null;
        }
      });
    };
    const reportingMeta = (status) => {
      const variants = {
        rejected: {
          label: "No",
          classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200"
        },
        pending: {
          label: "Pending review",
          classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
        },
        resolved: {
          label: "Yes",
          classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
        },
        clear: {
          label: "Active",
          classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
        }
      };
      return variants[status] || variants.clear;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-7xl mx-auto transition-colors px-4 sm:px-6 lg:px-0"${_scopeId}><div class="mt-8"${_scopeId}>`);
            if (unref(page).props.auth?.user && unref(page).props.auth.user.verification_status !== "verified") {
              _push2(`<div class="mb-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-4 py-3 flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-semibold text-sm"${_scopeId}>Get verified to add trust badges to your listings.</p><p class="text-sm text-amber-700/80 dark:text-amber-100/80"${_scopeId}>Submit your business details for review.</p></div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/verification",
                class: "px-3 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Submit verification `);
                  } else {
                    return [
                      createTextVNode(" Submit verification ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"${_scopeId}><div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm"${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Listing views</p><p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(__props.analytics?.total_views || 0)}</p></div><div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm"${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Contacts received</p><p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(__props.analytics?.total_contacts || 0)}</p></div><div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm"${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Portfolio views</p><p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(__props.analytics?.total_portfolio_views || 0)}</p></div><div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Top listing</p><p class="text-base font-semibold text-gray-900 dark:text-white mt-1"${_scopeId}>${ssrInterpolate(__props.analytics?.top_listing?.company_name || "—")}</p></div><p class="text-sm text-gray-500 dark:text-gray-400 mt-2"${_scopeId}>${ssrInterpolate(__props.analytics?.top_listing ? `${__props.analytics.top_listing.views_count} views` : "No data yet")}</p></div></div><div class="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>My Listings</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/listings/create",
              class: "inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> Add New Listing `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Add New Listing ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.listings.length > 0 || search.value) {
              _push2(`<div class="mb-6"${_scopeId}><div class="relative"${_scopeId}><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Search listings..." class="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.listings.length === 0 && !search.value) {
              _push2(ssrRenderComponent(_sfc_main$k, {
                title: "No listings yet",
                description: "Create your first photography listing to start showcasing your work.",
                "button-text": "Create Your First Listing",
                "button-href": "/listings/create"
              }, null, _parent2, _scopeId));
            } else if (__props.listings.length === 0 && search.value) {
              _push2(`<div class="text-center py-12"${_scopeId}><svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><p class="text-gray-500 dark:text-gray-400"${_scopeId}>No listings found matching &quot;${ssrInterpolate(search.value)}&quot;</p></div>`);
            } else {
              _push2(`<div class="overflow-x-auto"${_scopeId}><table class="w-full border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"${_scopeId}><thead class="bg-gray-100 dark:bg-gray-800/70"${_scopeId}><tr class="border-b border-gray-200 dark:border-gray-800"${_scopeId}><th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Company Name</th><th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Location</th><th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Types</th><th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Views</th><th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Contacts</th><th class="text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Visible</th><th class="text-right py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100"${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listings, (listing) => {
                _push2(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"${_scopeId}><td class="py-4 px-4"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/listings/${listing.id}`,
                  class: "font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(listing.company_name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(listing.company_name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (unref(page).props.auth?.user?.verification_status === "verified") {
                  _push2(`<span class="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg> Verified </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</td><td class="py-4 px-4 text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(listing.city)}, ${ssrInterpolate(listing.state)}</td><td class="py-4 px-4"${_scopeId}><div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
                ssrRenderList(listing.photography_types.slice(0, 2), (type) => {
                  _push2(`<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"${_scopeId}>${ssrInterpolate(type.name)}</span>`);
                });
                _push2(`<!--]-->`);
                if (listing.photography_types.length > 2) {
                  _push2(`<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"${_scopeId}> +${ssrInterpolate(listing.photography_types.length - 2)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></td><td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(listing.views_count || 0)}</td><td class="py-4 px-4 text-center text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(listing.contacts_count || 0)}</td><td class="py-4 px-4 text-center"${_scopeId}><span class="${ssrRenderClass([reportingMeta(listing.reporting_status).classes, "inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full"])}"${_scopeId}>${ssrInterpolate(reportingMeta(listing.reporting_status).label)}</span></td><td class="py-4 px-4"${_scopeId}><div class="flex items-center justify-end gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/listings/${listing.id}/portfolios`,
                  class: "px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Portfolios `);
                    } else {
                      return [
                        createTextVNode(" Portfolios ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/listings/${listing.id}/edit`,
                  class: "px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"${_scopeId}> Delete </button></div></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: !!pendingDelete.value,
              title: "Delete listing?",
              message: pendingDelete.value ? `Deleting ${pendingDelete.value.company_name} will remove portfolios and images. This cannot be undone.` : "",
              "confirm-text": "Delete",
              "cancel-text": "Cancel",
              "onUpdate:show": ($event) => pendingDelete.value = null,
              onConfirm: deleteListing
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-7xl mx-auto transition-colors px-4 sm:px-6 lg:px-0" }, [
                createVNode("div", { class: "mt-8" }, [
                  unref(page).props.auth?.user && unref(page).props.auth.user.verification_status !== "verified" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-4 py-3 flex items-center justify-between gap-3"
                  }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "font-semibold text-sm" }, "Get verified to add trust badges to your listings."),
                      createVNode("p", { class: "text-sm text-amber-700/80 dark:text-amber-100/80" }, "Submit your business details for review.")
                    ]),
                    createVNode(unref(Link), {
                      href: "/verification",
                      class: "px-3 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Submit verification ")
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" }, [
                  createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Listing views"),
                    createVNode("p", { class: "text-3xl font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(__props.analytics?.total_views || 0), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Contacts received"),
                    createVNode("p", { class: "text-3xl font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(__props.analytics?.total_contacts || 0), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm" }, [
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Portfolio views"),
                    createVNode("p", { class: "text-3xl font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(__props.analytics?.total_portfolio_views || 0), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col justify-between" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Top listing"),
                      createVNode("p", { class: "text-base font-semibold text-gray-900 dark:text-white mt-1" }, toDisplayString(__props.analytics?.top_listing?.company_name || "—"), 1)
                    ]),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mt-2" }, toDisplayString(__props.analytics?.top_listing ? `${__props.analytics.top_listing.views_count} views` : "No data yet"), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" }, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "My Listings"),
                    createVNode(unref(Link), {
                      href: "/listings/create",
                      class: "inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 4v16m8-8H4"
                          })
                        ])),
                        createTextVNode(" Add New Listing ")
                      ]),
                      _: 1
                    })
                  ]),
                  __props.listings.length > 0 || search.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-6"
                  }, [
                    createVNode("div", { class: "relative" }, [
                      (openBlock(), createBlock("svg", {
                        class: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        })
                      ])),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => search.value = $event,
                        type: "text",
                        placeholder: "Search listings...",
                        class: "w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, search.value]
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.listings.length === 0 && !search.value ? (openBlock(), createBlock(_sfc_main$k, {
                    key: 1,
                    title: "No listings yet",
                    description: "Create your first photography listing to start showcasing your work.",
                    "button-text": "Create Your First Listing",
                    "button-href": "/listings/create"
                  })) : __props.listings.length === 0 && search.value ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "text-center py-12"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-12 h-12 text-gray-400 mx-auto mb-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      })
                    ])),
                    createVNode("p", { class: "text-gray-500 dark:text-gray-400" }, 'No listings found matching "' + toDisplayString(search.value) + '"', 1)
                  ])) : (openBlock(), createBlock("div", {
                    key: 3,
                    class: "overflow-x-auto"
                  }, [
                    createVNode("table", { class: "w-full border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden" }, [
                      createVNode("thead", { class: "bg-gray-100 dark:bg-gray-800/70" }, [
                        createVNode("tr", { class: "border-b border-gray-200 dark:border-gray-800" }, [
                          createVNode("th", { class: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Company Name"),
                          createVNode("th", { class: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Location"),
                          createVNode("th", { class: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Types"),
                          createVNode("th", { class: "text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Views"),
                          createVNode("th", { class: "text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Contacts"),
                          createVNode("th", { class: "text-center py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Visible"),
                          createVNode("th", { class: "text-right py-3 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-gray-700 dark:text-gray-100" }, "Actions")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.listings, (listing) => {
                          return openBlock(), createBlock("tr", {
                            key: listing.id,
                            class: "hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                          }, [
                            createVNode("td", { class: "py-4 px-4" }, [
                              createVNode(unref(Link), {
                                href: `/listings/${listing.id}`,
                                class: "font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(listing.company_name), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"]),
                              unref(page).props.auth?.user?.verification_status === "verified" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M5 13l4 4L19 7"
                                  })
                                ])),
                                createTextVNode(" Verified ")
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("td", { class: "py-4 px-4 text-gray-600 dark:text-gray-300" }, toDisplayString(listing.city) + ", " + toDisplayString(listing.state), 1),
                            createVNode("td", { class: "py-4 px-4" }, [
                              createVNode("div", { class: "flex flex-wrap gap-1" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(listing.photography_types.slice(0, 2), (type) => {
                                  return openBlock(), createBlock("span", {
                                    key: type.id,
                                    class: "px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                  }, toDisplayString(type.name), 1);
                                }), 128)),
                                listing.photography_types.length > 2 ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }, " +" + toDisplayString(listing.photography_types.length - 2), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("td", { class: "py-4 px-4 text-center text-gray-600 dark:text-gray-300" }, toDisplayString(listing.views_count || 0), 1),
                            createVNode("td", { class: "py-4 px-4 text-center text-gray-600 dark:text-gray-300" }, toDisplayString(listing.contacts_count || 0), 1),
                            createVNode("td", { class: "py-4 px-4 text-center" }, [
                              createVNode("span", {
                                class: ["inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full", reportingMeta(listing.reporting_status).classes]
                              }, toDisplayString(reportingMeta(listing.reporting_status).label), 3)
                            ]),
                            createVNode("td", { class: "py-4 px-4" }, [
                              createVNode("div", { class: "flex items-center justify-end gap-2" }, [
                                createVNode(unref(Link), {
                                  href: `/listings/${listing.id}/portfolios`,
                                  class: "px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Portfolios ")
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode(unref(Link), {
                                  href: `/listings/${listing.id}/edit`,
                                  class: "px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode("button", {
                                  onClick: ($event) => promptDelete(listing),
                                  class: "px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                }, " Delete ", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]))
                ])
              ]),
              createVNode(_sfc_main$o, {
                show: !!pendingDelete.value,
                title: "Delete listing?",
                message: pendingDelete.value ? `Deleting ${pendingDelete.value.company_name} will remove portfolios and images. This cannot be undone.` : "",
                "confirm-text": "Delete",
                "cancel-text": "Cancel",
                "onUpdate:show": ($event) => pendingDelete.value = null,
                onConfirm: deleteListing
              }, null, 8, ["show", "message", "onUpdate:show"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = {
  __name: "SearchFilters",
  __ssrInlineRender: true,
  props: {
    filters: Object
  },
  setup(__props) {
    const props = __props;
    const search = ref(props.filters?.q || "");
    const performSearch = debounce(() => {
      router.get("/", {
        q: search.value || void 0
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    }, 300);
    watch([search], () => {
      performSearch();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-4xl mx-auto" }, _attrs))}><div class="relative"><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Try “wedding photographers in Panama City, FL”" class="w-full px-6 py-4 pl-14 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"><svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SearchFilters.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: "ListingCard",
  __ssrInlineRender: true,
  props: {
    listing: Object
  },
  setup(__props) {
    const props = __props;
    const coverImage = computed(() => {
      return props.listing.images?.[0]?.url || null;
    });
    const isVerified = computed(() => props.listing.user?.verification_status === "verified");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: `/listings/${__props.listing.id}`,
        class: "block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-gray-700/30 transition-all duration-300 group"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden"${_scopeId}>`);
            if (coverImage.value) {
              _push2(`<img${ssrRenderAttr("src", coverImage.value)}${ssrRenderAttr("alt", __props.listing.company_name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center"${_scopeId}><svg class="w-12 h-12 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg></div>`);
            }
            if (isVerified.value) {
              _push2(`<div class="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg> Verified </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4"${_scopeId}><h3 class="font-semibold text-lg text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</h3><p class="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center"${_scopeId}><svg class="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg> ${ssrInterpolate(__props.listing.city)}, ${ssrInterpolate(__props.listing.state)}</p><div class="flex flex-wrap gap-1.5 mt-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.listing.photography_types?.slice(0, 2), (type) => {
              _push2(`<span class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"${_scopeId}>${ssrInterpolate(type.name)}</span>`);
            });
            _push2(`<!--]-->`);
            if (__props.listing.photography_types?.length > 2) {
              _push2(`<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium"${_scopeId}> +${ssrInterpolate(__props.listing.photography_types.length - 2)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400"${_scopeId}><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg> ${ssrInterpolate(__props.listing.images_count || 0)} images <span class="mx-2 text-gray-300 dark:text-gray-600"${_scopeId}>|</span><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"${_scopeId}></path></svg> ${ssrInterpolate(__props.listing.portfolios_count || 0)} portfolios </div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden" }, [
                coverImage.value ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: coverImage.value,
                  alt: __props.listing.company_name,
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-12 h-12 text-gray-300 dark:text-gray-500",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    })
                  ]))
                ])),
                isVerified.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M5 13l4 4L19 7"
                    })
                  ])),
                  createTextVNode(" Verified ")
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "p-4" }, [
                createVNode("h3", { class: "font-semibold text-lg text-gray-900 dark:text-white truncate" }, toDisplayString(__props.listing.company_name), 1),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 mr-1 text-gray-400 dark:text-gray-500",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(__props.listing.city) + ", " + toDisplayString(__props.listing.state), 1)
                ]),
                createVNode("div", { class: "flex flex-wrap gap-1.5 mt-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.photography_types?.slice(0, 2), (type) => {
                    return openBlock(), createBlock("span", {
                      key: type.id,
                      class: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                    }, toDisplayString(type.name), 1);
                  }), 128)),
                  __props.listing.photography_types?.length > 2 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium"
                  }, " +" + toDisplayString(__props.listing.photography_types.length - 2), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 mr-1",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(__props.listing.images_count || 0) + " images ", 1),
                  createVNode("span", { class: "mx-2 text-gray-300 dark:text-gray-600" }, "|"),
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4 mr-1",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(__props.listing.portfolios_count || 0) + " portfolios ", 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ListingCard.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    listings: Object,
    stats: Object,
    filters: Object,
    curatedListings: Array,
    curatedCity: String
  },
  setup(__props) {
    const locating = ref(false);
    const locationError = ref("");
    const geolocate = async () => {
      locationError.value = "";
      if (!("geolocation" in navigator)) {
        locationError.value = "Location is not supported in this browser.";
        return;
      }
      locating.value = true;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
              headers: {
                "Accept-Language": "en"
              }
            });
            if (!resp.ok) {
              throw new Error("Unable to detect city.");
            }
            const data = await resp.json();
            const address = data.address || {};
            const city = address.city || address.town || address.village || address.county || null;
            const state = address.state || address.region || null;
            const stateCode = address.state_code || null;
            const cityLabel = city && (stateCode || state) ? `${city}, ${stateCode || state}` : city || stateCode || state;
            if (!cityLabel) {
              throw new Error("Could not determine your city.");
            }
            router.visit("/", {
              data: { curated_city: cityLabel, curated_state: stateCode || state },
              only: ["curatedListings", "curatedCity"],
              preserveScroll: true,
              replace: true
            });
          } catch (error) {
            locationError.value = error.message || "Unable to detect city.";
          } finally {
            locating.value = false;
          }
        },
        (err) => {
          locating.value = false;
          if (err.code === err.PERMISSION_DENIED) {
            locationError.value = "Permission denied. Please allow location access to show nearby picks.";
          } else {
            locationError.value = "Unable to detect city.";
          }
        },
        { timeout: 8e3, maximumAge: 0 }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Photography Directory - Find Professional Photographers</title><meta name="description" content="Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you."${_scopeId}><meta property="og:title" content="Photography Directory - Find Professional Photographers"${_scopeId}><meta property="og:description" content="Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you."${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary"${_scopeId}><meta name="twitter:title" content="Photography Directory"${_scopeId}><meta name="twitter:description" content="Find professional photographers for your next project."${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, "Photography Directory - Find Professional Photographers"),
              createVNode("meta", {
                name: "description",
                content: "Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you."
              }),
              createVNode("meta", {
                property: "og:title",
                content: "Photography Directory - Find Professional Photographers"
              }),
              createVNode("meta", {
                property: "og:description",
                content: "Browse and connect with professional photographers. Find wedding, portrait, event, and commercial photographers near you."
              }),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: "Photography Directory"
              }),
              createVNode("meta", {
                name: "twitter:description",
                content: "Find professional photographers for your next project."
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black"${_scopeId}><div class="absolute inset-0 pointer-events-none"${_scopeId}><div class="absolute inset-0 opacity-10" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)", "background-size": "36px 36px" })}"${_scopeId}></div><div class="absolute -left-20 top-10 w-80 h-80 bg-primary-500/30 blur-3xl rounded-full"${_scopeId}></div><div class="absolute -right-10 bottom-10 w-96 h-96 bg-cyan-400/25 blur-3xl rounded-full"${_scopeId}></div></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"${_scopeId}><div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"${_scopeId}><div class="lg:col-span-7 space-y-6"${_scopeId}><div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-primary-200 border border-white/15 backdrop-blur"${_scopeId}><span class="inline-flex h-2 w-2 rounded-full bg-green-400"${_scopeId}></span> Verified photographers </div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"${_scopeId}> Find the right photographer, <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-cyan-200 to-primary-300"${_scopeId}>faster.</span></h1><p class="text-lg sm:text-xl text-slate-200/90 max-w-2xl"${_scopeId}> Natural-language search understands what you need—try “wedding photographers in Panama City, FL” and jump straight to the best matches. </p><div class="space-y-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$i, { filters: __props.filters }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-3 text-sm text-slate-200/90"${_scopeId}><button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-60"${ssrIncludeBooleanAttr(locating.value) ? " disabled" : ""}${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21l-8-8 8-8 8 8-8 8z"${_scopeId}></path></svg>`);
            if (!locating.value) {
              _push2(`<span${_scopeId}>Use my location for curated picks</span>`);
            } else {
              _push2(`<span${_scopeId}>Detecting…</span>`);
            }
            _push2(`</button>`);
            if (locationError.value) {
              _push2(`<span class="text-amber-200"${_scopeId}>${ssrInterpolate(locationError.value)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="lg:col-span-5"${_scopeId}><div class="relative bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 backdrop-blur"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="text-white"${_scopeId}><p class="text-sm text-slate-300"${_scopeId}> Top matches near <span class="font-semibold text-white"${_scopeId}>${ssrInterpolate(__props.curatedCity || __props.curatedListings?.[0]?.city || "your area")}</span></p><p class="text-xl font-semibold"${_scopeId}>Curated portfolio tiles</p></div></div><div class="grid grid-cols-2 gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.curatedListings, (listing) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: listing.id,
                href: `/listings/${listing.id}`,
                class: "group relative rounded-xl overflow-hidden bg-white/10 border border-white/10 h-32"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (listing.images?.[0]?.url) {
                      _push3(`<img${ssrRenderAttr("src", listing.images[0].url)}${ssrRenderAttr("alt", listing.company_name)} class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId2}>`);
                    } else {
                      _push3(`<div class="h-full w-full bg-gradient-to-br from-slate-100/10 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60"${_scopeId2}></div>`);
                    }
                    _push3(`<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"${_scopeId2}></div><div class="absolute bottom-2 left-2 right-2 text-white"${_scopeId2}><p class="text-sm font-semibold truncate"${_scopeId2}>${ssrInterpolate(listing.company_name)}</p><p class="text-xs text-white/80 truncate"${_scopeId2}>${ssrInterpolate(listing.city)}, ${ssrInterpolate(listing.state)}</p></div>`);
                  } else {
                    return [
                      listing.images?.[0]?.url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: listing.images[0].url,
                        alt: listing.company_name,
                        class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "h-full w-full bg-gradient-to-br from-slate-100/10 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60"
                      })),
                      createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" }),
                      createVNode("div", { class: "absolute bottom-2 left-2 right-2 text-white" }, [
                        createVNode("p", { class: "text-sm font-semibold truncate" }, toDisplayString(listing.company_name), 1),
                        createVNode("p", { class: "text-xs text-white/80 truncate" }, toDisplayString(listing.city) + ", " + toDisplayString(listing.state), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            if (!__props.curatedListings?.length) {
              _push2(`<div class="rounded-xl overflow-hidden bg-white/10 h-32 border border-white/10 flex items-center justify-center text-white/70 text-sm col-span-2"${_scopeId}> No nearby picks yet—browse all below. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div></div></section><section class="py-12 md:py-18 bg-slate-50 dark:bg-slate-900"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"${_scopeId}>Browse</p><h2 class="text-3xl font-bold text-slate-900 dark:text-white"${_scopeId}>Featured Photographers</h2><p class="text-slate-600 dark:text-slate-400 mt-1"${_scopeId}>${ssrInterpolate(__props.listings?.total || 0)} photographers match your search. </p></div></div>`);
            if (__props.listings?.data?.length > 0) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listings.data, (listing) => {
                _push2(ssrRenderComponent(_sfc_main$h, {
                  key: listing.id,
                  listing
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-20"${_scopeId}><div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6"${_scopeId}><svg class="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg></div><h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2"${_scopeId}>No photographers found</h3><p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto"${_scopeId}> Try a broader phrase, different city/state wording, or remove niche keywords to see more results. </p></div>`);
            }
            if (__props.listings?.last_page > 1) {
              _push2(`<div class="mt-10 flex flex-wrap justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listings.links, (link) => {
                _push2(`<!--[-->`);
                if (link.url) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: [
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      link.active ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    ],
                    "preserve-scroll": ""
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span class="${ssrRenderClass([
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  ])}"${_scopeId}>${link.label ?? ""}</span>`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section><section class="py-16 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800"${_scopeId}><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300"${_scopeId}>Quality control</p><h2 class="text-3xl font-bold text-slate-900 dark:text-white mt-2"${_scopeId}>Verified listings you can trust.</h2><p class="mt-3 text-slate-600 dark:text-slate-300"${_scopeId}> We manually review every verification request to keep the directory reputable and authentic. Verified businesses get a badge on their listings, and rejected accounts are hidden until resolved. </p><div class="mt-6 space-y-3 text-slate-700 dark:text-slate-200"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"${_scopeId}></span> Business registration check for the claimed state. </div><div class="flex items-start gap-3"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"${_scopeId}></span> BBB standing review to screen for issues. </div><div class="flex items-start gap-3"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-emerald-500"${_scopeId}></span> In-platform contact so conversations stay on record. </div></div><div class="mt-6 flex flex-col sm:flex-row gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/verification",
              class: "inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Submit verification `);
                } else {
                  return [
                    createTextVNode(" Submit verification ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Browse verified listings `);
                } else {
                  return [
                    createTextVNode(" Browse verified listings ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl"${_scopeId}><div class="text-white font-semibold text-lg mb-4"${_scopeId}>How verification works</div><div class="space-y-4"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold"${_scopeId}>1</div><div${_scopeId}><p class="text-white font-semibold"${_scopeId}>Submit your business</p><p class="text-slate-300 text-sm"${_scopeId}>Share your business name, owner details, and registration info.</p></div></div><div class="flex items-start gap-3"${_scopeId}><div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold"${_scopeId}>2</div><div${_scopeId}><p class="text-white font-semibold"${_scopeId}>We review &amp; verify</p><p class="text-slate-300 text-sm"${_scopeId}>We check registration and BBB standing. If rejected, we share notes.</p></div></div><div class="flex items-start gap-3"${_scopeId}><div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold"${_scopeId}>3</div><div${_scopeId}><p class="text-white font-semibold"${_scopeId}>Badge on your listings</p><p class="text-slate-300 text-sm"${_scopeId}>Approved accounts get a verified badge, boosting trust with clients.</p></div></div></div><div class="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200"${_scopeId}> Rejected accounts are hidden until they’re re-approved, keeping search results clean and trustworthy. </div></div></div></section><section class="py-14 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center"${_scopeId}><div class="relative"${_scopeId}><div class="absolute -inset-4 bg-gradient-to-br from-primary-500/10 via-cyan-500/10 to-primary-500/10 blur-3xl rounded-3xl"${_scopeId}></div><div class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 p-6 space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-slate-500 dark:text-slate-400"${_scopeId}>This week</p><p class="text-2xl font-bold text-slate-900 dark:text-white"${_scopeId}>Engagement snapshot</p></div></div><div class="grid grid-cols-2 gap-3"${_scopeId}><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400"${_scopeId}>Profile views</p><p class="text-xl font-semibold text-slate-900 dark:text-white mt-1"${_scopeId}>248</p><p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1"${_scopeId}>+18% vs last week</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400"${_scopeId}>Contacts</p><p class="text-xl font-semibold text-slate-900 dark:text-white mt-1"${_scopeId}>14</p><p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1"${_scopeId}>+9% vs last week</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400"${_scopeId}>Portfolio views</p><p class="text-xl font-semibold text-slate-900 dark:text-white mt-1"${_scopeId}>132</p><p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1"${_scopeId}>+22% vs last week</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"${_scopeId}><p class="text-xs text-slate-500 dark:text-slate-400"${_scopeId}>Top city</p><p class="text-xl font-semibold text-slate-900 dark:text-white mt-1"${_scopeId}>Austin, TX</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-1"${_scopeId}>33 views this week</p></div></div><p class="text-sm text-slate-500 dark:text-slate-400"${_scopeId}> Get weekly summaries in your inbox and drill down anytime from your dashboard. </p></div></div><div class="space-y-4"${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300"${_scopeId}>Analytics</p><h2 class="text-3xl font-bold text-slate-900 dark:text-white"${_scopeId}>See what’s working.</h2><p class="text-slate-600 dark:text-slate-300"${_scopeId}> FocusFolio tracks the metrics that matter so you know where to invest: views, contacts, portfolio impressions, and which cities are finding you. </p><div class="grid sm:grid-cols-2 gap-3"${_scopeId}><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"${_scopeId}><p class="text-sm font-semibold text-slate-900 dark:text-white"${_scopeId}>Profile views</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-1"${_scopeId}>See spikes after edits or promos.</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"${_scopeId}><p class="text-sm font-semibold text-slate-900 dark:text-white"${_scopeId}>Contacts &amp; replies</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-1"${_scopeId}>Track inquiries and follow-ups.</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"${_scopeId}><p class="text-sm font-semibold text-slate-900 dark:text-white"${_scopeId}>Portfolio views</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-1"${_scopeId}>Know which sets resonate.</p></div><div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"${_scopeId}><p class="text-sm font-semibold text-slate-900 dark:text-white"${_scopeId}>Top locations</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-1"${_scopeId}>See which cities discover you most.</p></div></div></div></div></section><section class="relative py-16 md:py-20 overflow-hidden"${_scopeId}><div class="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-600"${_scopeId}></div><div class="absolute inset-0 opacity-10"${_scopeId}><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", "background-size": "30px 30px" })}"${_scopeId}></div></div><div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="grid md:grid-cols-3 gap-6"${_scopeId}><div class="md:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-8 text-white shadow-2xl shadow-black/20"${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-white/70 mb-2"${_scopeId}>Showcase</p><h2 class="text-3xl md:text-4xl font-bold mb-4"${_scopeId}>Join the directory and book more shoots.</h2><p class="text-white/80 max-w-2xl"${_scopeId}> Publish your listing, upload a gallery, and respond to inquiries directly inside the platform—no more mailto links. </p><div class="mt-8 flex flex-col sm:flex-row gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/register",
              class: "inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg shadow-black/10"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create Your Listing `);
                } else {
                  return [
                    createTextVNode(" Create Your Listing ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/login",
              class: "inline-flex items-center justify-center px-6 py-3 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/25"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Sign In `);
                } else {
                  return [
                    createTextVNode(" Sign In ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl shadow-black/10 border border-white/60"${_scopeId}><p class="text-sm font-semibold text-primary-600"${_scopeId}>Why photographers choose us</p><ul class="mt-4 space-y-3 text-slate-700"${_scopeId}><li class="flex items-start gap-2"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-primary-500"${_scopeId}></span> Verified badges to build trust and rank higher in local results. </li><li class="flex items-start gap-2"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-primary-500"${_scopeId}></span> In-app messaging that emails you instantly—no lost leads. </li><li class="flex items-start gap-2"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-primary-500"${_scopeId}></span> Curated nearby placement so clients see you first in their city/state. </li><li class="flex items-start gap-2"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-primary-500"${_scopeId}></span> Portfolio + gallery support with on-site lightbox and ordering. </li></ul></div></div></div></section><footer class="bg-gray-900 dark:bg-black py-12"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex flex-col md:flex-row justify-between items-center gap-4"${_scopeId}><div class="text-gray-400 text-sm"${_scopeId}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Photography Directory. All rights reserved. </div><div class="flex items-center gap-6 text-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/privacy",
              class: "text-gray-400 hover:text-white transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Privacy`);
                } else {
                  return [
                    createTextVNode("Privacy")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/terms",
              class: "text-gray-400 hover:text-white transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Terms`);
                } else {
                  return [
                    createTextVNode("Terms")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<a href="#" class="text-gray-400 hover:text-white transition-colors"${_scopeId}>Contact</a></div></div></div></footer>`);
          } else {
            return [
              createVNode("section", { class: "relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black" }, [
                createVNode("div", { class: "absolute inset-0 pointer-events-none" }, [
                  createVNode("div", {
                    class: "absolute inset-0 opacity-10",
                    style: { "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)", "background-size": "36px 36px" }
                  }),
                  createVNode("div", { class: "absolute -left-20 top-10 w-80 h-80 bg-primary-500/30 blur-3xl rounded-full" }),
                  createVNode("div", { class: "absolute -right-10 bottom-10 w-96 h-96 bg-cyan-400/25 blur-3xl rounded-full" })
                ]),
                createVNode("div", { class: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" }, [
                  createVNode("div", { class: "grid lg:grid-cols-12 gap-10 lg:gap-14 items-center" }, [
                    createVNode("div", { class: "lg:col-span-7 space-y-6" }, [
                      createVNode("div", { class: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-primary-200 border border-white/15 backdrop-blur" }, [
                        createVNode("span", { class: "inline-flex h-2 w-2 rounded-full bg-green-400" }),
                        createTextVNode(" Verified photographers ")
                      ]),
                      createVNode("h1", { class: "text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight" }, [
                        createTextVNode(" Find the right photographer, "),
                        createVNode("span", { class: "text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-cyan-200 to-primary-300" }, "faster.")
                      ]),
                      createVNode("p", { class: "text-lg sm:text-xl text-slate-200/90 max-w-2xl" }, " Natural-language search understands what you need—try “wedding photographers in Panama City, FL” and jump straight to the best matches. "),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode(_sfc_main$i, { filters: __props.filters }, null, 8, ["filters"]),
                        createVNode("div", { class: "flex items-center gap-3 text-sm text-slate-200/90" }, [
                          createVNode("button", {
                            type: "button",
                            class: "inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-60",
                            onClick: geolocate,
                            disabled: locating.value
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M12 21l-8-8 8-8 8 8-8 8z"
                              })
                            ])),
                            !locating.value ? (openBlock(), createBlock("span", { key: 0 }, "Use my location for curated picks")) : (openBlock(), createBlock("span", { key: 1 }, "Detecting…"))
                          ], 8, ["disabled"]),
                          locationError.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-amber-200"
                          }, toDisplayString(locationError.value), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "lg:col-span-5" }, [
                      createVNode("div", { class: "relative bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 backdrop-blur" }, [
                        createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                          createVNode("div", { class: "text-white" }, [
                            createVNode("p", { class: "text-sm text-slate-300" }, [
                              createTextVNode(" Top matches near "),
                              createVNode("span", { class: "font-semibold text-white" }, toDisplayString(__props.curatedCity || __props.curatedListings?.[0]?.city || "your area"), 1)
                            ]),
                            createVNode("p", { class: "text-xl font-semibold" }, "Curated portfolio tiles")
                          ])
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.curatedListings, (listing) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: listing.id,
                              href: `/listings/${listing.id}`,
                              class: "group relative rounded-xl overflow-hidden bg-white/10 border border-white/10 h-32"
                            }, {
                              default: withCtx(() => [
                                listing.images?.[0]?.url ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: listing.images[0].url,
                                  alt: listing.company_name,
                                  class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "h-full w-full bg-gradient-to-br from-slate-100/10 to-white/10 dark:from-slate-800/60 dark:to-slate-700/60"
                                })),
                                createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" }),
                                createVNode("div", { class: "absolute bottom-2 left-2 right-2 text-white" }, [
                                  createVNode("p", { class: "text-sm font-semibold truncate" }, toDisplayString(listing.company_name), 1),
                                  createVNode("p", { class: "text-xs text-white/80 truncate" }, toDisplayString(listing.city) + ", " + toDisplayString(listing.state), 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["href"]);
                          }), 128)),
                          !__props.curatedListings?.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "rounded-xl overflow-hidden bg-white/10 h-32 border border-white/10 flex items-center justify-center text-white/70 text-sm col-span-2"
                          }, " No nearby picks yet—browse all below. ")) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("section", { class: "py-12 md:py-18 bg-slate-50 dark:bg-slate-900" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400" }, "Browse"),
                      createVNode("h2", { class: "text-3xl font-bold text-slate-900 dark:text-white" }, "Featured Photographers"),
                      createVNode("p", { class: "text-slate-600 dark:text-slate-400 mt-1" }, toDisplayString(__props.listings?.total || 0) + " photographers match your search. ", 1)
                    ])
                  ]),
                  __props.listings?.data?.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.listings.data, (listing) => {
                      return openBlock(), createBlock(_sfc_main$h, {
                        key: listing.id,
                        listing
                      }, null, 8, ["listing"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-20"
                  }, [
                    createVNode("div", { class: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-10 h-10 text-slate-400 dark:text-slate-500",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "1.5",
                          d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        })
                      ]))
                    ]),
                    createVNode("h3", { class: "text-xl font-semibold text-slate-900 dark:text-white mb-2" }, "No photographers found"),
                    createVNode("p", { class: "text-slate-500 dark:text-slate-400 max-w-md mx-auto" }, " Try a broader phrase, different city/state wording, or remove niche keywords to see more results. ")
                  ])),
                  __props.listings?.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "mt-10 flex flex-wrap justify-center gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.listings.links, (link) => {
                      return openBlock(), createBlock(Fragment, {
                        key: link.label
                      }, [
                        link.url ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: link.url,
                          class: [
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            link.active ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                          ],
                          innerHTML: link.label,
                          "preserve-scroll": ""
                        }, null, 8, ["href", "class", "innerHTML"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: [
                            "px-4 py-2 rounded-lg text-sm font-medium",
                            "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                          ],
                          innerHTML: link.label
                        }, null, 8, ["innerHTML"]))
                      ], 64);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ]),
              createVNode("section", { class: "py-16 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800" }, [
                createVNode("div", { class: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300" }, "Quality control"),
                    createVNode("h2", { class: "text-3xl font-bold text-slate-900 dark:text-white mt-2" }, "Verified listings you can trust."),
                    createVNode("p", { class: "mt-3 text-slate-600 dark:text-slate-300" }, " We manually review every verification request to keep the directory reputable and authentic. Verified businesses get a badge on their listings, and rejected accounts are hidden until resolved. "),
                    createVNode("div", { class: "mt-6 space-y-3 text-slate-700 dark:text-slate-200" }, [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-emerald-500" }),
                        createTextVNode(" Business registration check for the claimed state. ")
                      ]),
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-emerald-500" }),
                        createTextVNode(" BBB standing review to screen for issues. ")
                      ]),
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-emerald-500" }),
                        createTextVNode(" In-platform contact so conversations stay on record. ")
                      ])
                    ]),
                    createVNode("div", { class: "mt-6 flex flex-col sm:flex-row gap-3" }, [
                      createVNode(unref(Link), {
                        href: "/verification",
                        class: "inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Submit verification ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Link), {
                        href: "/",
                        class: "inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Browse verified listings ")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode("div", { class: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl" }, [
                    createVNode("div", { class: "text-white font-semibold text-lg mb-4" }, "How verification works"),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", { class: "h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold" }, "1"),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-white font-semibold" }, "Submit your business"),
                          createVNode("p", { class: "text-slate-300 text-sm" }, "Share your business name, owner details, and registration info.")
                        ])
                      ]),
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", { class: "h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold" }, "2"),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-white font-semibold" }, "We review & verify"),
                          createVNode("p", { class: "text-slate-300 text-sm" }, "We check registration and BBB standing. If rejected, we share notes.")
                        ])
                      ]),
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode("div", { class: "h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center font-bold" }, "3"),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-white font-semibold" }, "Badge on your listings"),
                          createVNode("p", { class: "text-slate-300 text-sm" }, "Approved accounts get a verified badge, boosting trust with clients.")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200" }, " Rejected accounts are hidden until they’re re-approved, keeping search results clean and trustworthy. ")
                  ])
                ])
              ]),
              createVNode("section", { class: "py-14 md:py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center" }, [
                  createVNode("div", { class: "relative" }, [
                    createVNode("div", { class: "absolute -inset-4 bg-gradient-to-br from-primary-500/10 via-cyan-500/10 to-primary-500/10 blur-3xl rounded-3xl" }),
                    createVNode("div", { class: "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/10 p-6 space-y-4" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, "This week"),
                          createVNode("p", { class: "text-2xl font-bold text-slate-900 dark:text-white" }, "Engagement snapshot")
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" }, [
                          createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Profile views"),
                          createVNode("p", { class: "text-xl font-semibold text-slate-900 dark:text-white mt-1" }, "248"),
                          createVNode("p", { class: "text-xs text-emerald-600 dark:text-emerald-400 mt-1" }, "+18% vs last week")
                        ]),
                        createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" }, [
                          createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Contacts"),
                          createVNode("p", { class: "text-xl font-semibold text-slate-900 dark:text-white mt-1" }, "14"),
                          createVNode("p", { class: "text-xs text-emerald-600 dark:text-emerald-400 mt-1" }, "+9% vs last week")
                        ]),
                        createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" }, [
                          createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Portfolio views"),
                          createVNode("p", { class: "text-xl font-semibold text-slate-900 dark:text-white mt-1" }, "132"),
                          createVNode("p", { class: "text-xs text-emerald-600 dark:text-emerald-400 mt-1" }, "+22% vs last week")
                        ]),
                        createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" }, [
                          createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Top city"),
                          createVNode("p", { class: "text-xl font-semibold text-slate-900 dark:text-white mt-1" }, "Austin, TX"),
                          createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-1" }, "33 views this week")
                        ])
                      ]),
                      createVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, " Get weekly summaries in your inbox and drill down anytime from your dashboard. ")
                    ])
                  ]),
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300" }, "Analytics"),
                    createVNode("h2", { class: "text-3xl font-bold text-slate-900 dark:text-white" }, "See what’s working."),
                    createVNode("p", { class: "text-slate-600 dark:text-slate-300" }, " FocusFolio tracks the metrics that matter so you know where to invest: views, contacts, portfolio impressions, and which cities are finding you. "),
                    createVNode("div", { class: "grid sm:grid-cols-2 gap-3" }, [
                      createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }, [
                        createVNode("p", { class: "text-sm font-semibold text-slate-900 dark:text-white" }, "Profile views"),
                        createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-1" }, "See spikes after edits or promos.")
                      ]),
                      createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }, [
                        createVNode("p", { class: "text-sm font-semibold text-slate-900 dark:text-white" }, "Contacts & replies"),
                        createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-1" }, "Track inquiries and follow-ups.")
                      ]),
                      createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }, [
                        createVNode("p", { class: "text-sm font-semibold text-slate-900 dark:text-white" }, "Portfolio views"),
                        createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-1" }, "Know which sets resonate.")
                      ]),
                      createVNode("div", { class: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" }, [
                        createVNode("p", { class: "text-sm font-semibold text-slate-900 dark:text-white" }, "Top locations"),
                        createVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400 mt-1" }, "See which cities discover you most.")
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("section", { class: "relative py-16 md:py-20 overflow-hidden" }, [
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-600" }),
                createVNode("div", { class: "absolute inset-0 opacity-10" }, [
                  createVNode("div", {
                    class: "absolute inset-0",
                    style: { "background-image": "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", "background-size": "30px 30px" }
                  })
                ]),
                createVNode("div", { class: "relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "grid md:grid-cols-3 gap-6" }, [
                    createVNode("div", { class: "md:col-span-2 bg-white/10 border border-white/20 rounded-2xl p-8 text-white shadow-2xl shadow-black/20" }, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-white/70 mb-2" }, "Showcase"),
                      createVNode("h2", { class: "text-3xl md:text-4xl font-bold mb-4" }, "Join the directory and book more shoots."),
                      createVNode("p", { class: "text-white/80 max-w-2xl" }, " Publish your listing, upload a gallery, and respond to inquiries directly inside the platform—no more mailto links. "),
                      createVNode("div", { class: "mt-8 flex flex-col sm:flex-row gap-3" }, [
                        createVNode(unref(Link), {
                          href: "/register",
                          class: "inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg shadow-black/10"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Create Your Listing ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Link), {
                          href: "/login",
                          class: "inline-flex items-center justify-center px-6 py-3 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/25"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Sign In ")
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    createVNode("div", { class: "bg-white text-slate-900 rounded-2xl p-6 shadow-2xl shadow-black/10 border border-white/60" }, [
                      createVNode("p", { class: "text-sm font-semibold text-primary-600" }, "Why photographers choose us"),
                      createVNode("ul", { class: "mt-4 space-y-3 text-slate-700" }, [
                        createVNode("li", { class: "flex items-start gap-2" }, [
                          createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-primary-500" }),
                          createTextVNode(" Verified badges to build trust and rank higher in local results. ")
                        ]),
                        createVNode("li", { class: "flex items-start gap-2" }, [
                          createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-primary-500" }),
                          createTextVNode(" In-app messaging that emails you instantly—no lost leads. ")
                        ]),
                        createVNode("li", { class: "flex items-start gap-2" }, [
                          createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-primary-500" }),
                          createTextVNode(" Curated nearby placement so clients see you first in their city/state. ")
                        ]),
                        createVNode("li", { class: "flex items-start gap-2" }, [
                          createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-primary-500" }),
                          createTextVNode(" Portfolio + gallery support with on-site lightbox and ordering. ")
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("footer", { class: "bg-gray-900 dark:bg-black py-12" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row justify-between items-center gap-4" }, [
                    createVNode("div", { class: "text-gray-400 text-sm" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " Photography Directory. All rights reserved. ", 1),
                    createVNode("div", { class: "flex items-center gap-6 text-sm" }, [
                      createVNode(unref(Link), {
                        href: "/privacy",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Privacy")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Link), {
                        href: "/terms",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Terms")
                        ]),
                        _: 1
                      }),
                      createVNode("a", {
                        href: "#",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, "Contact")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {
  __name: "Privacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"${_scopeId}><div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"${_scopeId}>Policy</p><h1 class="text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Privacy Policy</h1><p class="text-gray-600 dark:text-gray-300 mt-2"${_scopeId}> How we collect, use, and protect your data when you browse, create listings, and contact photographers. </p></div><div class="space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed"${_scopeId}><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Information We Collect</h2><ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200"${_scopeId}><li${_scopeId}>Account details you provide when registering (name, email, password).</li><li${_scopeId}>Listing and portfolio content you upload, including photos and descriptions.</li><li${_scopeId}>Contact messages sent between clients and photographers.</li><li${_scopeId}>Usage data (page views, device/browser info) to keep the platform reliable.</li></ul></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>How We Use Your Information</h2><ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200"${_scopeId}><li${_scopeId}>Deliver core features like listings, portfolios, and in-app messaging.</li><li${_scopeId}>Send notifications related to your account and inquiries.</li><li${_scopeId}>Improve search, filters, and performance of the directory.</li></ul></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Data Sharing</h2><p${_scopeId}>We do not sell your data. We share only what’s necessary with trusted providers (e.g., storage, email) to operate the service.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Your Choices</h2><ul class="list-disc list-inside space-y-1"${_scopeId}><li${_scopeId}>Update or delete your profile and listings from your dashboard.</li><li${_scopeId}>Contact us to request data export or removal.</li><li${_scopeId}>Opt out of non-essential notifications in your account settings (when available).</li></ul></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Security</h2><p${_scopeId}>We use industry-standard security practices, access controls, and encrypted storage for sensitive assets.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Contact</h2><p${_scopeId}>If you have privacy questions, reach us at support@directory.local.</p></section></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, [
                createVNode("div", { class: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400" }, "Policy"),
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900 dark:text-white" }, "Privacy Policy"),
                    createVNode("p", { class: "text-gray-600 dark:text-gray-300 mt-2" }, " How we collect, use, and protect your data when you browse, create listings, and contact photographers. ")
                  ]),
                  createVNode("div", { class: "space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed" }, [
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Information We Collect"),
                      createVNode("ul", { class: "list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200" }, [
                        createVNode("li", null, "Account details you provide when registering (name, email, password)."),
                        createVNode("li", null, "Listing and portfolio content you upload, including photos and descriptions."),
                        createVNode("li", null, "Contact messages sent between clients and photographers."),
                        createVNode("li", null, "Usage data (page views, device/browser info) to keep the platform reliable.")
                      ])
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "How We Use Your Information"),
                      createVNode("ul", { class: "list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200" }, [
                        createVNode("li", null, "Deliver core features like listings, portfolios, and in-app messaging."),
                        createVNode("li", null, "Send notifications related to your account and inquiries."),
                        createVNode("li", null, "Improve search, filters, and performance of the directory.")
                      ])
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Data Sharing"),
                      createVNode("p", null, "We do not sell your data. We share only what’s necessary with trusted providers (e.g., storage, email) to operate the service.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Your Choices"),
                      createVNode("ul", { class: "list-disc list-inside space-y-1" }, [
                        createVNode("li", null, "Update or delete your profile and listings from your dashboard."),
                        createVNode("li", null, "Contact us to request data export or removal."),
                        createVNode("li", null, "Opt out of non-essential notifications in your account settings (when available).")
                      ])
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Security"),
                      createVNode("p", null, "We use industry-standard security practices, access controls, and encrypted storage for sensitive assets.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Contact"),
                      createVNode("p", null, "If you have privacy questions, reach us at support@directory.local.")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Legal/Privacy.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {
  __name: "Terms",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"${_scopeId}><div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"${_scopeId}>Terms</p><h1 class="text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>Terms of Service</h1><p class="text-gray-600 dark:text-gray-300 mt-2"${_scopeId}> Guidelines for using the Photography Directory platform as a photographer or client. </p></div><div class="space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed"${_scopeId}><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Acceptable Use</h2><ul class="list-disc list-inside space-y-1"${_scopeId}><li${_scopeId}>Provide accurate profile, listing, and portfolio information.</li><li${_scopeId}>Share only content you own the rights to, and respect others’ intellectual property.</li><li${_scopeId}>No spam, harassment, or misleading offers.</li></ul></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Listings &amp; Portfolios</h2><p${_scopeId}>You’re responsible for the accuracy of your listings, pricing, and availability. We may moderate or remove content that violates these terms.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Payments &amp; Bookings</h2><p${_scopeId}>If bookings or payments are enabled later, additional terms will apply. For now, inquiries and agreements are handled directly between clients and photographers.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Liability</h2><p${_scopeId}>The platform is provided “as is.” We’re not liable for interactions or agreements between users, nor for third-party service interruptions.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Termination</h2><p${_scopeId}>We may suspend or remove accounts that violate these terms or harm the community.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Changes</h2><p${_scopeId}>We may update these terms periodically. Continued use means you accept the latest version.</p></section><section${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"${_scopeId}>Contact</h2><p${_scopeId}>Questions? Email support@directory.local.</p></section></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" }, [
                createVNode("div", { class: "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 space-y-8" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400" }, "Terms"),
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900 dark:text-white" }, "Terms of Service"),
                    createVNode("p", { class: "text-gray-600 dark:text-gray-300 mt-2" }, " Guidelines for using the Photography Directory platform as a photographer or client. ")
                  ]),
                  createVNode("div", { class: "space-y-6 text-gray-700 dark:text-gray-200 leading-relaxed" }, [
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Acceptable Use"),
                      createVNode("ul", { class: "list-disc list-inside space-y-1" }, [
                        createVNode("li", null, "Provide accurate profile, listing, and portfolio information."),
                        createVNode("li", null, "Share only content you own the rights to, and respect others’ intellectual property."),
                        createVNode("li", null, "No spam, harassment, or misleading offers.")
                      ])
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Listings & Portfolios"),
                      createVNode("p", null, "You’re responsible for the accuracy of your listings, pricing, and availability. We may moderate or remove content that violates these terms.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Payments & Bookings"),
                      createVNode("p", null, "If bookings or payments are enabled later, additional terms will apply. For now, inquiries and agreements are handled directly between clients and photographers.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Liability"),
                      createVNode("p", null, "The platform is provided “as is.” We’re not liable for interactions or agreements between users, nor for third-party service interruptions.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Termination"),
                      createVNode("p", null, "We may suspend or remove accounts that violate these terms or harm the community.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Changes"),
                      createVNode("p", null, "We may update these terms periodically. Continued use means you accept the latest version.")
                    ]),
                    createVNode("section", null, [
                      createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, "Contact"),
                      createVNode("p", null, "Questions? Email support@directory.local.")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Legal/Terms.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {
  __name: "ImageUploader",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    existingImages: {
      type: Array,
      default: () => []
    },
    maxImages: {
      type: Number,
      default: 10
    },
    purpose: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue", "remove-existing"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const uploads = ref([]);
    const removedExisting = ref([]);
    const selectedIds = ref([...props.modelValue]);
    const uploadErrors = ref([]);
    watch(
      () => props.modelValue,
      (value) => {
        selectedIds.value = [...value];
      }
    );
    const activeExisting = computed(() => props.existingImages.filter((img) => !removedExisting.value.includes(img.id)));
    const remainingSlots = computed(() => Math.max(
      0,
      props.maxImages - activeExisting.value.length - uploads.value.length
    ));
    const formatSize = (bytes) => {
      if (!bytes) {
        return "0 B";
      }
      const units = ["B", "KB", "MB", "GB"];
      const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      return `${(bytes / 1024 ** exponent).toFixed(1)} ${units[exponent]}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (uploadErrors.value.length) {
        _push(`<div class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><p class="font-medium">Upload issues</p><ul class="list-disc pl-4"><!--[-->`);
        ssrRenderList(uploadErrors.value, (error, index) => {
          _push(`<li>${ssrInterpolate(error)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeExisting.value.length > 0) {
        _push(`<div class="grid grid-cols-2 gap-3 md:grid-cols-4"><!--[-->`);
        ssrRenderList(activeExisting.value, (image) => {
          _push(`<div class="relative overflow-hidden rounded-lg border border-gray-200 aspect-square"><img${ssrRenderAttr("src", image.url)} class="h-full w-full object-cover"><button type="button" class="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black/90"> Remove </button></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (uploads.value.length) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(uploads.value, (upload) => {
          _push(`<div class="flex items-center justify-between rounded-lg border border-gray-200 p-3"><div class="flex items-center gap-3"><div class="h-12 w-12 overflow-hidden rounded-md bg-gray-100">`);
          if (upload.previewUrl) {
            _push(`<img${ssrRenderAttr("src", upload.previewUrl)} class="h-full w-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div><p class="text-sm font-medium text-gray-900">${ssrInterpolate(upload.name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatSize(upload.size))}</p><div class="mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-100"><div class="h-2 rounded-full bg-blue-500 transition-all" style="${ssrRenderStyle({ width: `${upload.progress}%` })}"></div></div><p class="mt-1 text-xs uppercase tracking-wide text-gray-500">`);
          if (upload.status === "complete") {
            _push(`<span class="text-green-600">Ready</span>`);
          } else if (upload.status === "processing") {
            _push(`<span>Finalizing...</span>`);
          } else if (upload.status === "uploading") {
            _push(`<span>Uploading...</span>`);
          } else if (upload.status === "error") {
            _push(`<span class="text-red-600">Error</span>`);
          } else {
            _push(`<span>Starting...</span>`);
          }
          _push(`</p></div></div><button type="button" class="text-sm text-red-600 hover:text-red-700"> Remove </button></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (remainingSlots.value > 0) {
        _push(`<div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"><label class="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 px-4 text-center hover:bg-gray-100"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><div class="text-sm text-gray-700"> Drag and drop or <span class="font-medium text-blue-600">browse</span> high-quality images </div><p class="text-xs text-gray-500">Up to ${ssrInterpolate(remainingSlots.value)} more images</p><input type="file" multiple accept="image/jpeg,image/png,image/webp" class="hidden"></label></div>`);
      } else {
        _push(`<p class="text-sm text-gray-500 text-center"> Maximum images reached </p>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ImageUploader.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = {
  __name: "PhotographyTypeSelector",
  __ssrInlineRender: true,
  props: {
    photographyTypes: Array,
    modelValue: {
      type: Array,
      default: () => []
    },
    customTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue", "update:customTypes"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const newCustomType = ref("");
    const predefinedTypes = computed(() => {
      return props.photographyTypes.filter((t) => t.is_predefined);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(predefinedTypes.value, (type) => {
        _push(`<button type="button" class="${ssrRenderClass([
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          __props.modelValue?.includes(type.id) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        ])}">${ssrInterpolate(type.name)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (__props.customTypes?.length > 0) {
        _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(__props.customTypes, (type, index) => {
          _push(`<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">${ssrInterpolate(type)} <button type="button" class="ml-1 text-green-600 hover:text-green-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-2"><input${ssrRenderAttr("value", newCustomType.value)} type="text" placeholder="Add custom type..." class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><button type="button" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"> Add </button></div></div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PhotographyTypeSelector.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "TiptapEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Write something..."
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: props.placeholder
        })
      ],
      content: props.modelValue,
      editorProps: {
        attributes: {
          class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2"
        }
      },
      onUpdate: () => {
        emit("update:modelValue", editor.value.getHTML());
      }
    });
    watch(() => props.modelValue, (value) => {
      const isSame = editor.value.getHTML() === value;
      if (!isSame) {
        editor.value.commands.setContent(value, false);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent" }, _attrs))}><div class="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"><button type="button" class="${ssrRenderClass([
        "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("bold") }
      ])}" title="Bold"><svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z"></path></svg></button><button type="button" class="${ssrRenderClass([
        "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("italic") }
      ])}" title="Italic"><svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m4-16h-4m4 16h-4" transform="skewX(-10)"></path></svg></button><div class="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div><button type="button" class="${ssrRenderClass([
        "px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("heading", { level: 2 }) }
      ])}" title="Heading 2"> H2 </button><button type="button" class="${ssrRenderClass([
        "px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("heading", { level: 3 }) }
      ])}" title="Heading 3"> H3 </button><div class="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div><button type="button" class="${ssrRenderClass([
        "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("bulletList") }
      ])}" title="Bullet List"><svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path><circle cx="2" cy="6" r="1" fill="currentColor"></circle><circle cx="2" cy="12" r="1" fill="currentColor"></circle><circle cx="2" cy="18" r="1" fill="currentColor"></circle></svg></button><button type="button" class="${ssrRenderClass([
        "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
        { "bg-gray-200 dark:bg-gray-600": unref(editor)?.isActive("orderedList") }
      ])}" title="Ordered List"><svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13"></path><text x="2" y="8" font-size="6" fill="currentColor">1</text><text x="2" y="14" font-size="6" fill="currentColor">2</text><text x="2" y="20" font-size="6" fill="currentColor">3</text></svg></button></div><div class="bg-white dark:bg-gray-800">`);
      _push(ssrRenderComponent(unref(EditorContent), { editor: unref(editor) }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/TiptapEditor.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    photographyTypes: Array
  },
  setup(__props) {
    const form = useForm({
      company_name: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      description: "",
      starting_price: "",
      ending_price: "",
      highlights: [""],
      photography_types: [],
      custom_types: [],
      uploaded_images: []
    });
    const addHighlight = () => {
      form.highlights.push("");
    };
    const removeHighlight = (index) => {
      form.highlights.splice(index, 1);
      if (form.highlights.length === 0) {
        form.highlights.push("");
      }
    };
    const submit = () => {
      form.post("/listings");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0"${_scopeId}><div class="flex flex-wrap items-start justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Create New Listing</h1><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>Tell clients who you are and showcase your best work.</p></div></div><form class="grid grid-cols-1 gap-6 lg:grid-cols-3"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Listing Details</h2><span class="text-xs font-medium text-blue-600 dark:text-blue-300"${_scopeId}>Required *</span></div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Company Name * </label><input${ssrRenderAttr("value", unref(form).company_name)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.company_name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.company_name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> City * </label><input${ssrRenderAttr("value", unref(form).city)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.city) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.city)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> State * </label><input${ssrRenderAttr("value", unref(form).state)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.state) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.state)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Phone </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>At least one contact method required.</p><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Description </label>`);
            _push2(ssrRenderComponent(_sfc_main$b, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              placeholder: "Tell potential clients about your photography business..."
            }, null, _parent2, _scopeId));
            if (unref(form).errors.description) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Starting price </label><input${ssrRenderAttr("value", unref(form).starting_price)} type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1000"${_scopeId}>`);
            if (unref(form).errors.starting_price) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.starting_price)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Shown as “Prices starting at ...” when no max is provided.</p></div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Max package price (optional) </label><input${ssrRenderAttr("value", unref(form).ending_price)} type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5000"${_scopeId}>`);
            if (unref(form).errors.ending_price) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.ending_price)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>When provided, clients will see “Packages between ...”.</p></div></div></div></div><div class="space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Photography Types</h2><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>Select your specialties so clients can find you faster.</p>`);
            _push2(ssrRenderComponent(_sfc_main$c, {
              "photography-types": __props.photographyTypes,
              modelValue: unref(form).photography_types,
              "onUpdate:modelValue": ($event) => unref(form).photography_types = $event,
              "custom-types": unref(form).custom_types,
              "onUpdate:customTypes": ($event) => unref(form).custom_types = $event
            }, null, _parent2, _scopeId));
            if (unref(form).errors.photography_types) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.photography_types)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Showcase Images</h2><span class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Up to 10 images</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$d, {
              modelValue: unref(form).uploaded_images,
              "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
              "max-images": 10,
              purpose: "listing"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.uploaded_images) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.uploaded_images)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Highlights</h2><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>Short bullets clients will see on your listing.</p></div><button type="button" class="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60"${_scopeId}> + Add </button></div><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(form).highlights, (highlight, index) => {
              _push2(`<div class="space-y-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", unref(form).highlights[index])} type="text" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Fast turnaround times" maxlength="160"${_scopeId}><button type="button" class="rounded-md border border-gray-200 bg-white px-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"${ssrIncludeBooleanAttr(unref(form).highlights.length === 1) ? " disabled" : ""}${_scopeId}><span class="sr-only"${_scopeId}>Remove highlight</span> ✕ </button></div>`);
              if (unref(form).errors[`highlights.${index}`]) {
                _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors[`highlights.${index}`])}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (unref(form).errors.highlights) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.highlights)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/dashboard",
              class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Creating...</span>`);
            } else {
              _push2(`<span${_scopeId}>Create Listing</span>`);
            }
            _push2(`</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0" }, [
                createVNode("div", { class: "flex flex-wrap items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Create New Listing"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, "Tell clients who you are and showcase your best work.")
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "grid grid-cols-1 gap-6 lg:grid-cols-3"
                }, [
                  createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Listing Details"),
                        createVNode("span", { class: "text-xs font-medium text-blue-600 dark:text-blue-300" }, "Required *")
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Company Name * "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
                          type: "text",
                          required: "",
                          class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).company_name]
                        ]),
                        unref(form).errors.company_name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.company_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " City * "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).city = $event,
                            type: "text",
                            required: "",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).city]
                          ]),
                          unref(form).errors.city ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.city), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " State * "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).state = $event,
                            type: "text",
                            required: "",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).state]
                          ]),
                          unref(form).errors.state ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.state), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Phone "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                            type: "tel",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).phone]
                          ]),
                          unref(form).errors.phone ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Email "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).email]
                          ]),
                          unref(form).errors.email ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "At least one contact method required."),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Description "),
                        createVNode(_sfc_main$b, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Tell potential clients about your photography business..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Starting price "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).starting_price = $event,
                            type: "number",
                            min: "0",
                            step: "0.01",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "e.g. 1000"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).starting_price]
                          ]),
                          unref(form).errors.starting_price ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.starting_price), 1)) : createCommentVNode("", true),
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Shown as “Prices starting at ...” when no max is provided.")
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Max package price (optional) "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).ending_price = $event,
                            type: "number",
                            min: "0",
                            step: "0.01",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "e.g. 5000"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).ending_price]
                          ]),
                          unref(form).errors.ending_price ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.ending_price), 1)) : createCommentVNode("", true),
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "When provided, clients will see “Packages between ...”.")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Photography Types"),
                      createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, "Select your specialties so clients can find you faster."),
                      createVNode(_sfc_main$c, {
                        "photography-types": __props.photographyTypes,
                        modelValue: unref(form).photography_types,
                        "onUpdate:modelValue": ($event) => unref(form).photography_types = $event,
                        "custom-types": unref(form).custom_types,
                        "onUpdate:customTypes": ($event) => unref(form).custom_types = $event
                      }, null, 8, ["photography-types", "modelValue", "onUpdate:modelValue", "custom-types", "onUpdate:customTypes"]),
                      unref(form).errors.photography_types ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.photography_types), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Showcase Images"),
                        createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Up to 10 images")
                      ]),
                      createVNode(_sfc_main$d, {
                        modelValue: unref(form).uploaded_images,
                        "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
                        "max-images": 10,
                        purpose: "listing"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(form).errors.uploaded_images ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.uploaded_images), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", null, [
                          createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Highlights"),
                          createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, "Short bullets clients will see on your listing.")
                        ]),
                        createVNode("button", {
                          type: "button",
                          class: "inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60",
                          onClick: addHighlight
                        }, " + Add ")
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).highlights, (highlight, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "space-y-1"
                          }, [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).highlights[index] = $event,
                                type: "text",
                                class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                placeholder: "Fast turnaround times",
                                maxlength: "160"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).highlights[index]]
                              ]),
                              createVNode("button", {
                                type: "button",
                                class: "rounded-md border border-gray-200 bg-white px-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700",
                                disabled: unref(form).highlights.length === 1,
                                onClick: ($event) => removeHighlight(index)
                              }, [
                                createVNode("span", { class: "sr-only" }, "Remove highlight"),
                                createTextVNode(" ✕ ")
                              ], 8, ["disabled", "onClick"])
                            ]),
                            unref(form).errors[`highlights.${index}`] ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors[`highlights.${index}`]), 1)) : createCommentVNode("", true)
                          ]);
                        }), 128)),
                        unref(form).errors.highlights ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.highlights), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end" }, [
                    createVNode(unref(Link), {
                      href: "/dashboard",
                      class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Creating...")) : (openBlock(), createBlock("span", { key: 1 }, "Create Listing"))
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Create.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    listing: Object,
    photographyTypes: Array
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      company_name: props.listing.company_name,
      city: props.listing.city,
      state: props.listing.state,
      phone: props.listing.phone || "",
      email: props.listing.email || "",
      description: props.listing.description || "",
      starting_price: props.listing.price?.starting_price || "",
      ending_price: props.listing.price?.ending_price || "",
      highlights: props.listing.highlights?.length ? props.listing.highlights.map((highlight) => highlight.body) : [""],
      photography_types: props.listing.photography_types.map((t) => t.id),
      custom_types: [],
      uploaded_images: [],
      remove_images: []
    });
    const removedImageIds = ref([]);
    const handleRemoveExisting = (imageId) => {
      removedImageIds.value.push(imageId);
      form.remove_images = removedImageIds.value;
    };
    const addHighlight = () => {
      form.highlights.push("");
    };
    const removeHighlight = (index) => {
      form.highlights.splice(index, 1);
      if (form.highlights.length === 0) {
        form.highlights.push("");
      }
    };
    const submit = () => {
      form.transform((data) => ({
        ...data,
        _method: "PUT"
      })).post(`/listings/${props.listing.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0"${_scopeId}><div class="flex flex-wrap items-start justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Edit Listing</h1><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</p></div></div><form class="grid grid-cols-1 gap-6 lg:grid-cols-3"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Listing Details</h2><span class="text-xs font-medium text-blue-600 dark:text-blue-300"${_scopeId}>Required *</span></div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Company Name * </label><input${ssrRenderAttr("value", unref(form).company_name)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.company_name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.company_name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> City * </label><input${ssrRenderAttr("value", unref(form).city)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.city) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.city)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> State * </label><input${ssrRenderAttr("value", unref(form).state)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.state) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.state)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Phone </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>At least one contact method required.</p><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Description </label>`);
            _push2(ssrRenderComponent(_sfc_main$b, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              placeholder: "Tell potential clients about your photography business..."
            }, null, _parent2, _scopeId));
            if (unref(form).errors.description) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Starting price </label><input${ssrRenderAttr("value", unref(form).starting_price)} type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1000"${_scopeId}>`);
            if (unref(form).errors.starting_price) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.starting_price)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Shown as “Prices starting at ...” when no max is provided.</p></div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Max package price (optional) </label><input${ssrRenderAttr("value", unref(form).ending_price)} type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5000"${_scopeId}>`);
            if (unref(form).errors.ending_price) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.ending_price)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>When provided, clients will see “Packages between ...”.</p></div></div></div></div><div class="space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Photography Types</h2><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>Update your specialties to reach the right clients.</p>`);
            _push2(ssrRenderComponent(_sfc_main$c, {
              "photography-types": __props.photographyTypes,
              modelValue: unref(form).photography_types,
              "onUpdate:modelValue": ($event) => unref(form).photography_types = $event,
              "custom-types": unref(form).custom_types,
              "onUpdate:customTypes": ($event) => unref(form).custom_types = $event
            }, null, _parent2, _scopeId));
            if (unref(form).errors.photography_types) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.photography_types)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Showcase Images</h2><span class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Up to 10 images</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$d, {
              modelValue: unref(form).uploaded_images,
              "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
              "existing-images": __props.listing.images,
              "max-images": 10,
              purpose: "listing",
              onRemoveExisting: handleRemoveExisting
            }, null, _parent2, _scopeId));
            if (unref(form).errors.uploaded_images) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.uploaded_images)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Highlights</h2><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}>Short bullets clients will see on your listing.</p></div><button type="button" class="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60"${_scopeId}> + Add </button></div><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(form).highlights, (highlight, index) => {
              _push2(`<div class="space-y-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", unref(form).highlights[index])} type="text" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Fast turnaround times" maxlength="160"${_scopeId}><button type="button" class="rounded-md border border-gray-200 bg-white px-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"${ssrIncludeBooleanAttr(unref(form).highlights.length === 1) ? " disabled" : ""}${_scopeId}><span class="sr-only"${_scopeId}>Remove highlight</span> ✕ </button></div>`);
              if (unref(form).errors[`highlights.${index}`]) {
                _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors[`highlights.${index}`])}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (unref(form).errors.highlights) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.highlights)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/dashboard",
              class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Saving...</span>`);
            } else {
              _push2(`<span${_scopeId}>Save Changes</span>`);
            }
            _push2(`</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0" }, [
                createVNode("div", { class: "flex flex-wrap items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Edit Listing"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, toDisplayString(__props.listing.company_name), 1)
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "grid grid-cols-1 gap-6 lg:grid-cols-3"
                }, [
                  createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Listing Details"),
                        createVNode("span", { class: "text-xs font-medium text-blue-600 dark:text-blue-300" }, "Required *")
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Company Name * "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
                          type: "text",
                          required: "",
                          class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).company_name]
                        ]),
                        unref(form).errors.company_name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.company_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " City * "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).city = $event,
                            type: "text",
                            required: "",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).city]
                          ]),
                          unref(form).errors.city ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.city), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " State * "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).state = $event,
                            type: "text",
                            required: "",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).state]
                          ]),
                          unref(form).errors.state ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.state), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Phone "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                            type: "tel",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).phone]
                          ]),
                          unref(form).errors.phone ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Email "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).email]
                          ]),
                          unref(form).errors.email ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "At least one contact method required."),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Description "),
                        createVNode(_sfc_main$b, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Tell potential clients about your photography business..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Starting price "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).starting_price = $event,
                            type: "number",
                            min: "0",
                            step: "0.01",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "e.g. 1000"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).starting_price]
                          ]),
                          unref(form).errors.starting_price ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.starting_price), 1)) : createCommentVNode("", true),
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Shown as “Prices starting at ...” when no max is provided.")
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Max package price (optional) "),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).ending_price = $event,
                            type: "number",
                            min: "0",
                            step: "0.01",
                            class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            placeholder: "e.g. 5000"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).ending_price]
                          ]),
                          unref(form).errors.ending_price ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.ending_price), 1)) : createCommentVNode("", true),
                          createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, "When provided, clients will see “Packages between ...”.")
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Photography Types"),
                      createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, "Update your specialties to reach the right clients."),
                      createVNode(_sfc_main$c, {
                        "photography-types": __props.photographyTypes,
                        modelValue: unref(form).photography_types,
                        "onUpdate:modelValue": ($event) => unref(form).photography_types = $event,
                        "custom-types": unref(form).custom_types,
                        "onUpdate:customTypes": ($event) => unref(form).custom_types = $event
                      }, null, 8, ["photography-types", "modelValue", "onUpdate:modelValue", "custom-types", "onUpdate:customTypes"]),
                      unref(form).errors.photography_types ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.photography_types), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Showcase Images"),
                        createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Up to 10 images")
                      ]),
                      createVNode(_sfc_main$d, {
                        modelValue: unref(form).uploaded_images,
                        "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
                        "existing-images": __props.listing.images,
                        "max-images": 10,
                        purpose: "listing",
                        onRemoveExisting: handleRemoveExisting
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "existing-images"]),
                      unref(form).errors.uploaded_images ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.uploaded_images), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", null, [
                          createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Highlights"),
                          createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, "Short bullets clients will see on your listing.")
                        ]),
                        createVNode("button", {
                          type: "button",
                          class: "inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60",
                          onClick: addHighlight
                        }, " + Add ")
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(form).highlights, (highlight, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "space-y-1"
                          }, [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(form).highlights[index] = $event,
                                type: "text",
                                class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                placeholder: "Fast turnaround times",
                                maxlength: "160"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).highlights[index]]
                              ]),
                              createVNode("button", {
                                type: "button",
                                class: "rounded-md border border-gray-200 bg-white px-2 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700",
                                disabled: unref(form).highlights.length === 1,
                                onClick: ($event) => removeHighlight(index)
                              }, [
                                createVNode("span", { class: "sr-only" }, "Remove highlight"),
                                createTextVNode(" ✕ ")
                              ], 8, ["disabled", "onClick"])
                            ]),
                            unref(form).errors[`highlights.${index}`] ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors[`highlights.${index}`]), 1)) : createCommentVNode("", true)
                          ]);
                        }), 128)),
                        unref(form).errors.highlights ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.highlights), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end" }, [
                    createVNode(unref(Link), {
                      href: "/dashboard",
                      class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Saving...")) : (openBlock(), createBlock("span", { key: 1 }, "Save Changes"))
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Edit.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {
  __name: "PublicShow",
  __ssrInlineRender: true,
  props: {
    listing: Object,
    canBypassHidden: Boolean
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const appUrl = computed(() => page.props.appUrl);
    const flash = computed(() => page.props.flash || {});
    const metaDescription = computed(() => {
      if (props.listing.description) {
        const stripped = props.listing.description.replace(/<[^>]*>/g, "");
        return stripped.length > 160 ? stripped.substring(0, 157) + "..." : stripped;
      }
      return `${props.listing.company_name} - Professional photographer in ${props.listing.city}, ${props.listing.state}`;
    });
    const ogImage = computed(() => props.listing.images?.[0]?.url);
    const canonicalUrl = computed(() => `${appUrl.value}/listings/${props.listing.id}`);
    const structuredDataJson = computed(() => JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": canonicalUrl.value,
      name: props.listing.company_name,
      url: canonicalUrl.value,
      image: ogImage.value,
      address: {
        addressLocality: props.listing.city,
        addressRegion: props.listing.state,
        addressCountry: "US"
      },
      priceRange: props.listing.price?.label || void 0,
      telephone: props.listing.phone || void 0,
      email: props.listing.email || void 0,
      areaServed: props.listing.state,
      sameAs: [],
      knowsAbout: props.listing.photography_types?.map((type) => type.name) || []
    }));
    const jsonLdElementId = `listing-json-ld-${props.listing.id}`;
    const syncJsonLd = (payload) => {
      if (typeof document === "undefined") {
        return;
      }
      const existing = document.getElementById(jsonLdElementId);
      if (existing) {
        existing.textContent = payload;
        return;
      }
      const script = document.createElement("script");
      script.id = jsonLdElementId;
      script.type = "application/ld+json";
      script.textContent = payload;
      document.head.appendChild(script);
    };
    watch(structuredDataJson, (value) => {
      syncJsonLd(value);
    }, { immediate: true });
    onBeforeUnmount(() => {
      if (typeof document === "undefined") {
        return;
      }
      const existing = document.getElementById(jsonLdElementId);
      if (existing) {
        existing.remove();
      }
    });
    const selectedImage = ref(null);
    const showContact = ref(false);
    const form = useForm({
      name: page.props.auth?.user?.name ?? "",
      email: page.props.auth?.user?.email ?? "",
      phone: "",
      message: ""
    });
    const showFlag = ref(false);
    const flagForm = useForm({
      reason: "",
      categories: []
    });
    const hasPrice = computed(() => Boolean(props.listing.price?.label));
    const hasHighlights = computed(() => Array.isArray(props.listing.highlights) && props.listing.highlights.length > 0);
    const hasPortfolios = computed(() => Array.isArray(props.listing.portfolios) && props.listing.portfolios.length > 0);
    const showSidebar = computed(() => hasPrice.value || hasHighlights.value || hasPortfolios.value);
    const showAdminFlagBanner = computed(() => {
      return page.props.auth?.user?.is_admin && props.listing.pending_flags_count >= 5;
    });
    const openLightbox = (image) => {
      selectedImage.value = image;
    };
    const closeLightbox = () => {
      selectedImage.value = null;
    };
    const openContact = () => {
      showContact.value = true;
    };
    const closeContact = () => {
      showContact.value = false;
    };
    const submitContact = () => {
      form.post(`/listings/${props.listing.id}/contact`, {
        preserveScroll: true,
        onSuccess: () => {
          form.reset();
          closeContact();
        }
      });
    };
    const openFlag = () => {
      showFlag.value = true;
    };
    const closeFlag = () => {
      showFlag.value = false;
      flagForm.reset();
      flagForm.clearErrors();
    };
    const submitFlag = () => {
      flagForm.post(`/listings/${props.listing.id}/flag`, {
        preserveScroll: true,
        onSuccess: closeFlag
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(__props.listing.company_name)} | Photography Directory</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.listing.company_name)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta property="og:image"${ssrRenderAttr("content", ogImage.value)}${_scopeId}><meta property="og:type" content="website"${_scopeId}><meta property="og:url"${ssrRenderAttr("content", canonicalUrl.value)}${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", __props.listing.company_name)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="twitter:image"${ssrRenderAttr("content", ogImage.value)}${_scopeId}><link rel="canonical"${ssrRenderAttr("href", canonicalUrl.value)}${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(__props.listing.company_name) + " | Photography Directory", 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.listing.company_name
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:image",
                content: ogImage.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                property: "og:url",
                content: canonicalUrl.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: __props.listing.company_name
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:image",
                content: ogImage.value
              }, null, 8, ["content"]),
              createVNode("link", {
                rel: "canonical",
                href: canonicalUrl.value
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (showAdminFlagBanner.value) {
              _push2(`<div class="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-3 flex items-start gap-3"${_scopeId}><svg class="w-5 h-5 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"${_scopeId}></path></svg><div class="text-sm"${_scopeId}><p class="font-semibold"${_scopeId}>Hidden from public due to a pending report.</p><p class="mt-1"${_scopeId}> Review and resolve in `);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/admin/flags",
                class: "underline font-semibold text-amber-800 hover:text-amber-900"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Admin Flags `);
                  } else {
                    return [
                      createTextVNode(" Admin Flags ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(` to restore visibility. </p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black overflow-hidden"${_scopeId}><div class="absolute inset-0 opacity-15 pointer-events-none" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", "background-size": "34px 34px" })}"${_scopeId}></div><div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"${_scopeId}></div><div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-20 md:pb-28"${_scopeId}><div class="flex items-center justify-between text-white/70 text-sm mb-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "inline-flex items-center hover:text-white transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId2}></path></svg> Back to browse `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                      })
                    ])),
                    createTextVNode(" Back to browse ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="grid md:grid-cols-3 gap-8 items-start"${_scopeId}><div class="md:col-span-2 space-y-4"${_scopeId}><h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</h1><div class="flex flex-wrap items-center gap-3 text-slate-200/90"${_scopeId}>`);
            if (__props.listing.user?.verification_status === "verified") {
              _push2(`<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-sm"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg> Verified business </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm"${_scopeId}><svg class="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg> ${ssrInterpolate(__props.listing.city)}, ${ssrInterpolate(__props.listing.state)}</span><div class="flex flex-wrap items-center gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.listing.photography_types, (type) => {
              _push2(`<span class="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-200 text-sm"${_scopeId}>${ssrInterpolate(type.name)}</span>`);
            });
            _push2(`<!--]--></div></div><div class="flex items-center space-x-3"${_scopeId}><button type="button" class="w-2/3 inline-flex items-center justify-center px-5 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"${_scopeId}> Get in Touch </button><button type="button" class="w-1/3 inline-flex items-center justify-center px-5 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"${_scopeId}> Report listing </button>`);
            if (flash.value?.success) {
              _push2(`<p class="text-sm text-emerald-600"${_scopeId}>${ssrInterpolate(flash.value.success)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div${_scopeId}></div></div></div></section><section class="py-14 md:py-18 bg-slate-50 dark:bg-slate-900"${_scopeId}><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="${ssrRenderClass(["grid grid-cols-1 gap-10 lg:gap-14 items-start", showSidebar.value ? "lg:grid-cols-3" : "lg:grid-cols-1"])}"${_scopeId}>`);
            if (__props.listing.description) {
              _push2(`<div class="${ssrRenderClass([
                "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm",
                showSidebar.value ? "lg:col-span-2" : "lg:col-span-1"
              ])}"${_scopeId}><h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3"${_scopeId}>About</h2><div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200 dark:prose-invert prose-p:leading-relaxed"${_scopeId}>${__props.listing.description ?? ""}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showSidebar.value) {
              _push2(`<div class="space-y-8"${_scopeId}>`);
              if (hasPrice.value) {
                _push2(`<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"${_scopeId}><h3 class="text-lg font-semibold text-slate-900 dark:text-white"${_scopeId}>Pricing</h3>`);
                if (__props.listing.price?.label) {
                  _push2(`<p class="mt-2 text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(__props.listing.price.label)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (hasHighlights.value) {
                _push2(`<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"${_scopeId}><h3 class="text-lg font-semibold text-slate-900 dark:text-white"${_scopeId}>Highlights</h3><ul class="mt-4 space-y-3 text-slate-700 dark:text-slate-200"${_scopeId}><!--[-->`);
                ssrRenderList(__props.listing.highlights, (highlight) => {
                  _push2(`<li class="flex items-start gap-2"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-primary-500"${_scopeId}></span><span${_scopeId}>${ssrInterpolate(highlight.body)}</span></li>`);
                });
                _push2(`<!--]--></ul></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (hasPortfolios.value) {
                _push2(`<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"${_scopeId}><h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4"${_scopeId}>Portfolios</h3><div class="space-y-4"${_scopeId}><!--[-->`);
                ssrRenderList(__props.listing.portfolios, (portfolio) => {
                  _push2(ssrRenderComponent(unref(Link), {
                    key: portfolio.id,
                    href: `/portfolios/${portfolio.id}`,
                    class: "flex items-center gap-4 group rounded-xl border border-transparent hover:border-primary-200 dark:hover:border-primary-900/60 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors px-2 py-2"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700"${_scopeId2}>`);
                        if (portfolio.images?.[0]) {
                          _push3(`<img${ssrRenderAttr("src", portfolio.images[0].url)}${ssrRenderAttr("alt", portfolio.name)} class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"${_scopeId2}>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div><div${_scopeId2}><p class="font-medium text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors"${_scopeId2}>${ssrInterpolate(portfolio.name)}</p><p class="text-sm text-slate-500 dark:text-slate-400"${_scopeId2}>${ssrInterpolate(portfolio.images?.length || 0)} images</p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700" }, [
                            portfolio.images?.[0] ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: portfolio.images[0].url,
                              alt: portfolio.name,
                              class: "w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors" }, toDisplayString(portfolio.name), 1),
                            createVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, toDisplayString(portfolio.images?.length || 0) + " images", 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]--></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.listing.images?.length > 0) {
              _push2(`<div class="${ssrRenderClass([
                "space-y-4",
                showSidebar.value ? "lg:col-span-3" : "lg:col-span-1"
              ])}"${_scopeId}><h2 class="text-lg font-semibold text-slate-900 dark:text-white"${_scopeId}>Gallery</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.images, (image) => {
                _push2(`<button type="button" class="group relative block w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><div class="aspect-square"${_scopeId}><img${ssrRenderAttr("src", image.url)}${ssrRenderAttr("alt", image.filename)} class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"${_scopeId}></div></button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></section><section class="relative py-20 overflow-hidden"${_scopeId}><div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500"${_scopeId}></div><div class="absolute inset-0 opacity-10"${_scopeId}><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", "background-size": "30px 30px" })}"${_scopeId}></div></div><div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"${_scopeId}><h2 class="text-3xl md:text-4xl font-bold text-white mb-4"${_scopeId}> Are You a Photographer? </h2><p class="text-lg text-white/80 mb-10 max-w-2xl mx-auto"${_scopeId}> Join our directory and showcase your work to thousands of potential clients. </p><div class="flex flex-col sm:flex-row gap-4 justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/register",
              class: "inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Create Your Listing `);
                } else {
                  return [
                    createTextVNode(" Create Your Listing ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Browse More `);
                } else {
                  return [
                    createTextVNode(" Browse More ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></section><footer class="bg-gray-900 dark:bg-black py-12"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex flex-col md:flex-row justify-between items-center gap-4"${_scopeId}><div class="text-gray-400 text-sm"${_scopeId}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Photography Directory. All rights reserved. </div><div class="flex items-center gap-6 text-sm"${_scopeId}><a href="#" class="text-gray-400 hover:text-white transition-colors"${_scopeId}>Privacy</a><a href="#" class="text-gray-400 hover:text-white transition-colors"${_scopeId}>Terms</a><a href="#" class="text-gray-400 hover:text-white transition-colors"${_scopeId}>Contact</a></div></div></div></footer>`);
            ssrRenderTeleport(_push2, (_push3) => {
              if (showContact.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"${_scopeId}><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"${_scopeId}></div><div class="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"${_scopeId}><div class="flex items-start justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Contact</p><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</h3></div><button type="button" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close contact modal"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></div><form class="mt-4 space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Your name</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required${_scopeId}>`);
                if (unref(form).errors.name) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required${_scopeId}>`);
                if (unref(form).errors.email) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Phone (optional)</label><input${ssrRenderAttr("value", unref(form).phone)} type="text" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"${_scopeId}>`);
                if (unref(form).errors.phone) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Message</label><textarea rows="4" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required${_scopeId}>${ssrInterpolate(unref(form).message)}</textarea>`);
                if (unref(form).errors.message) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(form).errors.message)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div class="flex items-center justify-end gap-3 pt-2"${_scopeId}><button type="button" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"${_scopeId}> Cancel </button><button type="submit" class="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
                if (unref(form).processing) {
                  _push3(`<svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(` Send Message </button></div></form></div></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
            ssrRenderTeleport(_push2, (_push3) => {
              if (showFlag.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"${_scopeId}><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"${_scopeId}></div><div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"${_scopeId}><div class="flex items-start justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>Report listing</p><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</h3></div><button type="button" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close flag modal"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></div><form class="mt-4 space-y-4"${_scopeId}><div class="space-y-2"${_scopeId}><p class="text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>Select issues</p><div class="grid grid-cols-2 gap-2 text-sm"${_scopeId}><label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(flagForm).categories) ? ssrLooseContain(unref(flagForm).categories, "spam") : unref(flagForm).categories) ? " checked" : ""} type="checkbox" value="spam" class="accent-primary-500"${_scopeId}><span${_scopeId}>Spam or ads</span></label><label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(flagForm).categories) ? ssrLooseContain(unref(flagForm).categories, "scam") : unref(flagForm).categories) ? " checked" : ""} type="checkbox" value="scam" class="accent-primary-500"${_scopeId}><span${_scopeId}>Scam or fraud</span></label><label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(flagForm).categories) ? ssrLooseContain(unref(flagForm).categories, "inaccurate") : unref(flagForm).categories) ? " checked" : ""} type="checkbox" value="inaccurate" class="accent-primary-500"${_scopeId}><span${_scopeId}>Inaccurate info</span></label><label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(flagForm).categories) ? ssrLooseContain(unref(flagForm).categories, "offensive") : unref(flagForm).categories) ? " checked" : ""} type="checkbox" value="offensive" class="accent-primary-500"${_scopeId}><span${_scopeId}>Offensive content</span></label><label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 col-span-2"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(flagForm).categories) ? ssrLooseContain(unref(flagForm).categories, "other") : unref(flagForm).categories) ? " checked" : ""} type="checkbox" value="other" class="accent-primary-500"${_scopeId}><span${_scopeId}>Something else</span></label></div>`);
                if (unref(flagForm).errors.categories) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(flagForm).errors.categories)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"${_scopeId}>Additional details (optional)</label><textarea rows="4" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"${_scopeId}>${ssrInterpolate(unref(flagForm).reason)}</textarea>`);
                if (unref(flagForm).errors.reason) {
                  _push3(`<p class="text-sm text-red-500 mt-1"${_scopeId}>${ssrInterpolate(unref(flagForm).errors.reason)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div class="flex items-center justify-end gap-3 pt-2"${_scopeId}><button type="button" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"${_scopeId}> Cancel </button><button type="submit" class="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"${ssrIncludeBooleanAttr(unref(flagForm).processing) ? " disabled" : ""}${_scopeId}>`);
                if (unref(flagForm).processing) {
                  _push3(`<svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(` Submit report </button></div></form></div></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
            ssrRenderTeleport(_push2, (_push3) => {
              if (selectedImage.value) {
                _push3(`<div class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"${_scopeId}><button class="absolute top-6 right-6 text-white/70 hover:text-white text-4xl"${_scopeId}> × </button><img${ssrRenderAttr("src", selectedImage.value.url)} class="max-h-[90vh] max-w-[90vw] object-contain"${_scopeId}></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
          } else {
            return [
              showAdminFlagBanner.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "bg-amber-100 text-amber-900 border border-amber-300 px-4 py-3 flex items-start gap-3"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mt-0.5 text-amber-600",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  })
                ])),
                createVNode("div", { class: "text-sm" }, [
                  createVNode("p", { class: "font-semibold" }, "Hidden from public due to a pending report."),
                  createVNode("p", { class: "mt-1" }, [
                    createTextVNode(" Review and resolve in "),
                    createVNode(unref(Link), {
                      href: "/admin/flags",
                      class: "underline font-semibold text-amber-800 hover:text-amber-900"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Admin Flags ")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" to restore visibility. ")
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode("section", { class: "relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black overflow-hidden" }, [
                createVNode("div", {
                  class: "absolute inset-0 opacity-15 pointer-events-none",
                  style: { "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", "background-size": "34px 34px" }
                }),
                createVNode("div", { class: "absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" }),
                createVNode("div", { class: "relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-20 md:pb-28" }, [
                  createVNode("div", { class: "flex items-center justify-between text-white/70 text-sm mb-6" }, [
                    createVNode(unref(Link), {
                      href: "/",
                      class: "inline-flex items-center hover:text-white transition-colors"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                          })
                        ])),
                        createTextVNode(" Back to browse ")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid md:grid-cols-3 gap-8 items-start" }, [
                    createVNode("div", { class: "md:col-span-2 space-y-4" }, [
                      createVNode("h1", { class: "text-4xl sm:text-5xl font-bold text-white leading-tight" }, toDisplayString(__props.listing.company_name), 1),
                      createVNode("div", { class: "flex flex-wrap items-center gap-3 text-slate-200/90" }, [
                        __props.listing.user?.verification_status === "verified" ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-sm"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M5 13l4 4L19 7"
                            })
                          ])),
                          createTextVNode(" Verified business ")
                        ])) : createCommentVNode("", true),
                        createVNode("span", { class: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 text-slate-200",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            }),
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            })
                          ])),
                          createTextVNode(" " + toDisplayString(__props.listing.city) + ", " + toDisplayString(__props.listing.state), 1)
                        ]),
                        createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.photography_types, (type) => {
                            return openBlock(), createBlock("span", {
                              key: type.id,
                              class: "inline-flex items-center px-3 py-1 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-200 text-sm"
                            }, toDisplayString(type.name), 1);
                          }), 128))
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center space-x-3" }, [
                        createVNode("button", {
                          type: "button",
                          class: "w-2/3 inline-flex items-center justify-center px-5 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors",
                          onClick: openContact
                        }, " Get in Touch "),
                        createVNode("button", {
                          type: "button",
                          class: "w-1/3 inline-flex items-center justify-center px-5 py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors",
                          onClick: openFlag
                        }, " Report listing "),
                        flash.value?.success ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-emerald-600"
                        }, toDisplayString(flash.value.success), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div")
                  ])
                ])
              ]),
              createVNode("section", { class: "py-14 md:py-18 bg-slate-50 dark:bg-slate-900" }, [
                createVNode("div", { class: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", {
                    class: ["grid grid-cols-1 gap-10 lg:gap-14 items-start", showSidebar.value ? "lg:grid-cols-3" : "lg:grid-cols-1"]
                  }, [
                    __props.listing.description ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: [
                        "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm",
                        showSidebar.value ? "lg:col-span-2" : "lg:col-span-1"
                      ]
                    }, [
                      createVNode("h2", { class: "text-lg font-semibold text-slate-900 dark:text-white mb-3" }, "About"),
                      createVNode("div", {
                        class: "prose prose-sm max-w-none text-slate-700 dark:text-slate-200 dark:prose-invert prose-p:leading-relaxed",
                        innerHTML: __props.listing.description
                      }, null, 8, ["innerHTML"])
                    ], 2)) : createCommentVNode("", true),
                    showSidebar.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-8"
                    }, [
                      hasPrice.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
                      }, [
                        createVNode("h3", { class: "text-lg font-semibold text-slate-900 dark:text-white" }, "Pricing"),
                        __props.listing.price?.label ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-2 text-slate-700 dark:text-slate-200"
                        }, toDisplayString(__props.listing.price.label), 1)) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true),
                      hasHighlights.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
                      }, [
                        createVNode("h3", { class: "text-lg font-semibold text-slate-900 dark:text-white" }, "Highlights"),
                        createVNode("ul", { class: "mt-4 space-y-3 text-slate-700 dark:text-slate-200" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.highlights, (highlight) => {
                            return openBlock(), createBlock("li", {
                              key: highlight.id,
                              class: "flex items-start gap-2"
                            }, [
                              createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-primary-500" }),
                              createVNode("span", null, toDisplayString(highlight.body), 1)
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      hasPortfolios.value ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
                      }, [
                        createVNode("h3", { class: "text-lg font-semibold text-slate-900 dark:text-white mb-4" }, "Portfolios"),
                        createVNode("div", { class: "space-y-4" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.portfolios, (portfolio) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: portfolio.id,
                              href: `/portfolios/${portfolio.id}`,
                              class: "flex items-center gap-4 group rounded-xl border border-transparent hover:border-primary-200 dark:hover:border-primary-900/60 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors px-2 py-2"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700" }, [
                                  portfolio.images?.[0] ? (openBlock(), createBlock("img", {
                                    key: 0,
                                    src: portfolio.images[0].url,
                                    alt: portfolio.name,
                                    class: "w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "font-medium text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors" }, toDisplayString(portfolio.name), 1),
                                  createVNode("p", { class: "text-sm text-slate-500 dark:text-slate-400" }, toDisplayString(portfolio.images?.length || 0) + " images", 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["href"]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    __props.listing.images?.length > 0 ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: [
                        "space-y-4",
                        showSidebar.value ? "lg:col-span-3" : "lg:col-span-1"
                      ]
                    }, [
                      createVNode("h2", { class: "text-lg font-semibold text-slate-900 dark:text-white" }, "Gallery"),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.images, (image) => {
                          return openBlock(), createBlock("button", {
                            key: image.id,
                            type: "button",
                            class: "group relative block w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
                            onClick: ($event) => openLightbox(image)
                          }, [
                            createVNode("div", { class: "aspect-square" }, [
                              createVNode("img", {
                                src: image.url,
                                alt: image.filename,
                                class: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                              }, null, 8, ["src", "alt"])
                            ])
                          ], 8, ["onClick"]);
                        }), 128))
                      ])
                    ], 2)) : createCommentVNode("", true)
                  ], 2)
                ])
              ]),
              createVNode("section", { class: "relative py-20 overflow-hidden" }, [
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500" }),
                createVNode("div", { class: "absolute inset-0 opacity-10" }, [
                  createVNode("div", {
                    class: "absolute inset-0",
                    style: { "background-image": "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", "background-size": "30px 30px" }
                  })
                ]),
                createVNode("div", { class: "relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" }, [
                  createVNode("h2", { class: "text-3xl md:text-4xl font-bold text-white mb-4" }, " Are You a Photographer? "),
                  createVNode("p", { class: "text-lg text-white/80 mb-10 max-w-2xl mx-auto" }, " Join our directory and showcase your work to thousands of potential clients. "),
                  createVNode("div", { class: "flex flex-col sm:flex-row gap-4 justify-center" }, [
                    createVNode(unref(Link), {
                      href: "/register",
                      class: "inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Create Your Listing ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Link), {
                      href: "/",
                      class: "inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Browse More ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("footer", { class: "bg-gray-900 dark:bg-black py-12" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row justify-between items-center gap-4" }, [
                    createVNode("div", { class: "text-gray-400 text-sm" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " Photography Directory. All rights reserved. ", 1),
                    createVNode("div", { class: "flex items-center gap-6 text-sm" }, [
                      createVNode("a", {
                        href: "#",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, "Privacy"),
                      createVNode("a", {
                        href: "#",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, "Terms"),
                      createVNode("a", {
                        href: "#",
                        class: "text-gray-400 hover:text-white transition-colors"
                      }, "Contact")
                    ])
                  ])
                ])
              ]),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                showContact.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 z-50 flex items-center justify-center px-4"
                }, [
                  createVNode("div", {
                    class: "absolute inset-0 bg-black/60 backdrop-blur-sm",
                    onClick: closeContact
                  }),
                  createVNode("div", { class: "relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6" }, [
                    createVNode("div", { class: "flex items-start justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Contact"),
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, toDisplayString(__props.listing.company_name), 1)
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                        onClick: closeContact,
                        "aria-label": "Close contact modal"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ]))
                      ])
                    ]),
                    createVNode("form", {
                      class: "mt-4 space-y-4",
                      onSubmit: withModifiers(submitContact, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Your name"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          type: "text",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).name]
                        ]),
                        unref(form).errors.name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500 mt-1"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Email"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            class: "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                            required: ""
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).email]
                          ]),
                          unref(form).errors.email ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500 mt-1"
                          }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Phone (optional)"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                            type: "text",
                            class: "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(form).phone]
                          ]),
                          unref(form).errors.phone ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500 mt-1"
                          }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Message"),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => unref(form).message = $event,
                          rows: "4",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).message]
                        ]),
                        unref(form).errors.message ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500 mt-1"
                        }, toDisplayString(unref(form).errors.message), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex items-center justify-end gap-3 pt-2" }, [
                        createVNode("button", {
                          type: "button",
                          class: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                          onClick: closeContact
                        }, " Cancel "),
                        createVNode("button", {
                          type: "submit",
                          class: "inline-flex items-center px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-60",
                          disabled: unref(form).processing
                        }, [
                          unref(form).processing ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "animate-spin h-4 w-4 mr-2 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            })
                          ])) : createCommentVNode("", true),
                          createTextVNode(" Send Message ")
                        ], 8, ["disabled"])
                      ])
                    ], 32)
                  ])
                ])) : createCommentVNode("", true)
              ])),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                showFlag.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 z-50 flex items-center justify-center px-4"
                }, [
                  createVNode("div", {
                    class: "absolute inset-0 bg-black/60 backdrop-blur-sm",
                    onClick: closeFlag
                  }),
                  createVNode("div", { class: "relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6" }, [
                    createVNode("div", { class: "flex items-start justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Report listing"),
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, toDisplayString(__props.listing.company_name), 1)
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                        onClick: closeFlag,
                        "aria-label": "Close flag modal"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ]))
                      ])
                    ]),
                    createVNode("form", {
                      class: "mt-4 space-y-4",
                      onSubmit: withModifiers(submitFlag, ["prevent"])
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("p", { class: "text-sm font-medium text-gray-700 dark:text-gray-300" }, "Select issues"),
                        createVNode("div", { class: "grid grid-cols-2 gap-2 text-sm" }, [
                          createVNode("label", { class: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(flagForm).categories = $event,
                              type: "checkbox",
                              value: "spam",
                              class: "accent-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(flagForm).categories]
                            ]),
                            createVNode("span", null, "Spam or ads")
                          ]),
                          createVNode("label", { class: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(flagForm).categories = $event,
                              type: "checkbox",
                              value: "scam",
                              class: "accent-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(flagForm).categories]
                            ]),
                            createVNode("span", null, "Scam or fraud")
                          ]),
                          createVNode("label", { class: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(flagForm).categories = $event,
                              type: "checkbox",
                              value: "inaccurate",
                              class: "accent-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(flagForm).categories]
                            ]),
                            createVNode("span", null, "Inaccurate info")
                          ]),
                          createVNode("label", { class: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(flagForm).categories = $event,
                              type: "checkbox",
                              value: "offensive",
                              class: "accent-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(flagForm).categories]
                            ]),
                            createVNode("span", null, "Offensive content")
                          ]),
                          createVNode("label", { class: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 col-span-2" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(flagForm).categories = $event,
                              type: "checkbox",
                              value: "other",
                              class: "accent-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(flagForm).categories]
                            ]),
                            createVNode("span", null, "Something else")
                          ])
                        ]),
                        unref(flagForm).errors.categories ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500 mt-1"
                        }, toDisplayString(unref(flagForm).errors.categories), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Additional details (optional)"),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => unref(flagForm).reason = $event,
                          rows: "4",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(flagForm).reason]
                        ]),
                        unref(flagForm).errors.reason ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500 mt-1"
                        }, toDisplayString(unref(flagForm).errors.reason), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex items-center justify-end gap-3 pt-2" }, [
                        createVNode("button", {
                          type: "button",
                          class: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                          onClick: closeFlag
                        }, " Cancel "),
                        createVNode("button", {
                          type: "submit",
                          class: "inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60",
                          disabled: unref(flagForm).processing
                        }, [
                          unref(flagForm).processing ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "animate-spin h-4 w-4 mr-2 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            })
                          ])) : createCommentVNode("", true),
                          createTextVNode(" Submit report ")
                        ], 8, ["disabled"])
                      ])
                    ], 32)
                  ])
                ])) : createCommentVNode("", true)
              ])),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                selectedImage.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4",
                  onClick: closeLightbox
                }, [
                  createVNode("button", {
                    class: "absolute top-6 right-6 text-white/70 hover:text-white text-4xl",
                    onClick: closeLightbox
                  }, " × "),
                  createVNode("img", {
                    src: selectedImage.value.url,
                    class: "max-h-[90vh] max-w-[90vw] object-contain",
                    onClick: withModifiers(() => {
                    }, ["stop"])
                  }, null, 8, ["src", "onClick"])
                ])) : createCommentVNode("", true)
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/PublicShow.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "ImageGallery",
  __ssrInlineRender: true,
  props: {
    images: Array
  },
  setup(__props) {
    const selectedIndex = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ tabindex: "0" }, _attrs))}><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(__props.images, (image, index) => {
        _push(`<div class="aspect-square cursor-pointer overflow-hidden rounded-lg"><img${ssrRenderAttr("src", image.url)}${ssrRenderAttr("alt", image.filename)} class="w-full h-full object-cover hover:scale-105 transition-transform"></div>`);
      });
      _push(`<!--]--></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (selectedIndex.value !== null) {
          _push2(`<div class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"><button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"> × </button>`);
          if (selectedIndex.value > 0) {
            _push2(`<button class="absolute left-4 text-white text-6xl hover:text-gray-300 z-10"> ‹ </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<img${ssrRenderAttr("src", __props.images[selectedIndex.value].url)} class="max-h-[90vh] max-w-[90vw] object-contain">`);
          if (selectedIndex.value < __props.images.length - 1) {
            _push2(`<button class="absolute right-4 text-white text-6xl hover:text-gray-300 z-10"> › </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ImageGallery.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    listing: Object
  },
  setup(__props) {
    const props = __props;
    const pendingDelete = ref(false);
    const deleteListing = () => {
      router.delete(`/listings/${props.listing.id}`, {
        onFinish: () => {
          pendingDelete.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto"${_scopeId}><div class="flex justify-between items-start mb-6"${_scopeId}><div${_scopeId}><h1 class="text-3xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</h1><p class="text-lg text-gray-600 mt-1"${_scopeId}>${ssrInterpolate(__props.listing.city)}, ${ssrInterpolate(__props.listing.state)}</p></div><div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.listing.id}/edit`,
              class: "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Edit `);
                } else {
                  return [
                    createTextVNode(" Edit ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"${_scopeId}> Delete </button></div></div>`);
            if (__props.listing.images?.length > 0) {
              _push2(`<div class="mb-8"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 mb-4"${_scopeId}>Showcase Images</h2>`);
              _push2(ssrRenderComponent(_sfc_main$7, {
                images: __props.listing.images
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-white rounded-lg shadow p-6 mb-8"${_scopeId}><div class="mb-6"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 mb-2"${_scopeId}>Contact</h3><div class="space-y-1 text-gray-600"${_scopeId}>`);
            if (__props.listing.phone) {
              _push2(`<p${_scopeId}><span class="font-medium"${_scopeId}>Phone:</span> ${ssrInterpolate(__props.listing.phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.listing.email) {
              _push2(`<p${_scopeId}><span class="font-medium"${_scopeId}>Email:</span> ${ssrInterpolate(__props.listing.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="mb-6"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 mb-2"${_scopeId}>Specialties</h3><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.listing.photography_types, (type) => {
              _push2(`<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"${_scopeId}>${ssrInterpolate(type.name)}</span>`);
            });
            _push2(`<!--]--></div></div><div class="mb-6"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 mb-2"${_scopeId}>Pricing</h3>`);
            if (__props.listing.price?.label) {
              _push2(`<p class="text-gray-700"${_scopeId}>${ssrInterpolate(__props.listing.price.label)}</p>`);
            } else {
              _push2(`<p class="text-gray-500"${_scopeId}>No pricing details added yet.</p>`);
            }
            _push2(`</div><div class="mb-6"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 mb-2"${_scopeId}>Highlights</h3>`);
            if (__props.listing.highlights?.length) {
              _push2(`<ul class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.highlights, (highlight) => {
                _push2(`<li class="flex items-start gap-2 text-gray-700"${_scopeId}><span class="mt-1 h-2 w-2 rounded-full bg-blue-500"${_scopeId}></span><span${_scopeId}>${ssrInterpolate(highlight.body)}</span></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<p class="text-gray-500"${_scopeId}>Add highlights to showcase quick facts about this listing.</p>`);
            }
            _push2(`</div>`);
            if (__props.listing.description) {
              _push2(`<div${_scopeId}><h3 class="text-lg font-semibold text-gray-900 mb-2"${_scopeId}>About</h3><p class="text-gray-600 whitespace-pre-line"${_scopeId}>${ssrInterpolate(__props.listing.description)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="bg-white rounded-lg shadow p-6"${_scopeId}><div class="flex justify-between items-center mb-4"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}>Portfolios</h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.listing.id}/portfolios/create`,
              class: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Add Portfolio `);
                } else {
                  return [
                    createTextVNode(" Add Portfolio ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.listing.portfolios?.length > 0) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.portfolios, (portfolio) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: portfolio.id,
                  href: `/portfolios/${portfolio.id}`,
                  class: "block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-4"${_scopeId2}>`);
                      if (portfolio.images?.[0]) {
                        _push3(`<div class="w-20 h-20 flex-shrink-0"${_scopeId2}><img${ssrRenderAttr("src", portfolio.images[0].url)}${ssrRenderAttr("alt", portfolio.name)} class="w-full h-full object-cover rounded"${_scopeId2}></div>`);
                      } else {
                        _push3(`<div class="w-20 h-20 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center"${_scopeId2}><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId2}></path></svg></div>`);
                      }
                      _push3(`<div${_scopeId2}><h3 class="font-medium text-gray-900"${_scopeId2}>${ssrInterpolate(portfolio.name)}</h3><p class="text-sm text-gray-500"${_scopeId2}>${ssrInterpolate(portfolio.images?.length || 0)} images </p></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          portfolio.images?.[0] ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "w-20 h-20 flex-shrink-0"
                          }, [
                            createVNode("img", {
                              src: portfolio.images[0].url,
                              alt: portfolio.name,
                              class: "w-full h-full object-cover rounded"
                            }, null, 8, ["src", "alt"])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-20 h-20 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-8 h-8 text-gray-400",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              })
                            ]))
                          ])),
                          createVNode("div", null, [
                            createVNode("h3", { class: "font-medium text-gray-900" }, toDisplayString(portfolio.name), 1),
                            createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(portfolio.images?.length || 0) + " images ", 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-gray-500 text-center py-8"${_scopeId}> No portfolios yet. Create one to showcase your work! </p>`);
            }
            _push2(`</div><div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/dashboard",
              class: "text-blue-600 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ← Back to Dashboard `);
                } else {
                  return [
                    createTextVNode(" ← Back to Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto" }, [
                createVNode("div", { class: "flex justify-between items-start mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900" }, toDisplayString(__props.listing.company_name), 1),
                    createVNode("p", { class: "text-lg text-gray-600 mt-1" }, toDisplayString(__props.listing.city) + ", " + toDisplayString(__props.listing.state), 1)
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(unref(Link), {
                      href: `/listings/${__props.listing.id}/edit`,
                      class: "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Edit ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      onClick: ($event) => pendingDelete.value = true,
                      class: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    }, " Delete ", 8, ["onClick"])
                  ])
                ]),
                __props.listing.images?.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-8"
                }, [
                  createVNode("h2", { class: "text-xl font-semibold text-gray-900 mb-4" }, "Showcase Images"),
                  createVNode(_sfc_main$7, {
                    images: __props.listing.images
                  }, null, 8, ["images"])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-white rounded-lg shadow p-6 mb-8" }, [
                  createVNode("div", { class: "mb-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-gray-900 mb-2" }, "Contact"),
                    createVNode("div", { class: "space-y-1 text-gray-600" }, [
                      __props.listing.phone ? (openBlock(), createBlock("p", { key: 0 }, [
                        createVNode("span", { class: "font-medium" }, "Phone:"),
                        createTextVNode(" " + toDisplayString(__props.listing.phone), 1)
                      ])) : createCommentVNode("", true),
                      __props.listing.email ? (openBlock(), createBlock("p", { key: 1 }, [
                        createVNode("span", { class: "font-medium" }, "Email:"),
                        createTextVNode(" " + toDisplayString(__props.listing.email), 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "mb-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-gray-900 mb-2" }, "Specialties"),
                    createVNode("div", { class: "flex flex-wrap gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.photography_types, (type) => {
                        return openBlock(), createBlock("span", {
                          key: type.id,
                          class: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        }, toDisplayString(type.name), 1);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", { class: "mb-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-gray-900 mb-2" }, "Pricing"),
                    __props.listing.price?.label ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-gray-700"
                    }, toDisplayString(__props.listing.price.label), 1)) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-gray-500"
                    }, "No pricing details added yet."))
                  ]),
                  createVNode("div", { class: "mb-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-gray-900 mb-2" }, "Highlights"),
                    __props.listing.highlights?.length ? (openBlock(), createBlock("ul", {
                      key: 0,
                      class: "space-y-2"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.highlights, (highlight) => {
                        return openBlock(), createBlock("li", {
                          key: highlight.id,
                          class: "flex items-start gap-2 text-gray-700"
                        }, [
                          createVNode("span", { class: "mt-1 h-2 w-2 rounded-full bg-blue-500" }),
                          createVNode("span", null, toDisplayString(highlight.body), 1)
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-gray-500"
                    }, "Add highlights to showcase quick facts about this listing."))
                  ]),
                  __props.listing.description ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("h3", { class: "text-lg font-semibold text-gray-900 mb-2" }, "About"),
                    createVNode("p", { class: "text-gray-600 whitespace-pre-line" }, toDisplayString(__props.listing.description), 1)
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                  createVNode("div", { class: "flex justify-between items-center mb-4" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, "Portfolios"),
                    createVNode(unref(Link), {
                      href: `/listings/${__props.listing.id}/portfolios/create`,
                      class: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Add Portfolio ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  __props.listing.portfolios?.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-1 md:grid-cols-2 gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.portfolios, (portfolio) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: portfolio.id,
                        href: `/portfolios/${portfolio.id}`,
                        class: "block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            portfolio.images?.[0] ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "w-20 h-20 flex-shrink-0"
                            }, [
                              createVNode("img", {
                                src: portfolio.images[0].url,
                                alt: portfolio.name,
                                class: "w-full h-full object-cover rounded"
                              }, null, 8, ["src", "alt"])
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-20 h-20 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-8 h-8 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                })
                              ]))
                            ])),
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-medium text-gray-900" }, toDisplayString(portfolio.name), 1),
                              createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(portfolio.images?.length || 0) + " images ", 1)
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-gray-500 text-center py-8"
                  }, " No portfolios yet. Create one to showcase your work! "))
                ]),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(unref(Link), {
                    href: "/dashboard",
                    class: "text-blue-600 hover:underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ← Back to Dashboard ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$o, {
        show: pendingDelete.value,
        title: "Delete listing?",
        message: "Deleting this listing will remove all portfolios and images. This cannot be undone.",
        "confirm-text": "Delete",
        "cancel-text": "Cancel",
        "onUpdate:show": ($event) => pendingDelete.value = $event,
        onConfirm: deleteListing
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Listings/Show.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    notifications: Object
  },
  setup(__props) {
    const selected = ref(null);
    const pendingDelete = ref(null);
    const open = (notification) => {
      selected.value = notification;
      if (!notification.read_at) {
        router.post("/notifications/mark-read", { notification_id: notification.id }, { preserveScroll: true });
      }
    };
    const close = () => {
      selected.value = null;
    };
    const destroyNotification = (notification) => {
      pendingDelete.value = notification;
    };
    const confirmDestroy = () => {
      if (!pendingDelete.value) {
        return;
      }
      const id = pendingDelete.value.id;
      router.delete(`/notifications/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          if (selected.value?.id === id) {
            selected.value = null;
          }
        },
        onFinish: () => {
          pendingDelete.value = null;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"${_scopeId}><div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Notifications</h1><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>View and manage your messages.</p></div></div><div class="overflow-x-auto"${_scopeId}><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-900/70"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200"${_scopeId}>From</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200"${_scopeId}>Listing</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200"${_scopeId}>Message</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200"${_scopeId}>Date</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200"${_scopeId}>Actions</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800"${_scopeId}><!--[-->`);
            ssrRenderList(__props.notifications.data, (notification) => {
              _push2(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"${_scopeId}><td class="px-4 py-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="${ssrRenderClass([notification.read_at ? "bg-gray-300 dark:bg-gray-500" : "bg-primary-400", "inline-flex h-2 w-2 rounded-full"])}"${_scopeId}></span><div${_scopeId}><div class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(notification.data?.from_name || "New message")}</div><div class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(notification.data?.from_email || "—")}</div></div></div></td><td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200"${_scopeId}>`);
              if (notification.listing?.id) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/listings/${notification.listing.id}`,
                  class: "text-primary-600 dark:text-primary-400 hover:underline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(notification.listing.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(notification.listing.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<span class="text-gray-500 dark:text-gray-400"${_scopeId}>—</span>`);
              }
              _push2(`</td><td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"${_scopeId}>${ssrInterpolate(notification.data?.message_preview || notification.data?.message || "—")}</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"${_scopeId}>${ssrInterpolate(new Date(notification.created_at).toLocaleString())}</td><td class="px-4 py-3 text-right"${_scopeId}><div class="flex items-center justify-end gap-2"${_scopeId}><button class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"${_scopeId}> View </button><button class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"${_scopeId}> Delete </button></div></td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (__props.notifications.links?.length) {
              _push2(`<div class="mt-6 flex flex-wrap gap-2 justify-center"${_scopeId}><!--[-->`);
              ssrRenderList(__props.notifications.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  "preserve-scroll": "",
                  class: [
                    "px-3 py-2 text-sm rounded-lg border",
                    link.active ? "bg-primary-500 text-white border-primary-500" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  ]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            ssrRenderTeleport(_push2, (_push3) => {
              if (selected.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center px-4"${_scopeId}><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"${_scopeId}></div><div class="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>From ${ssrInterpolate(selected.value.data?.from_name || "New message")}</p><h3 class="text-xl font-semibold text-gray-900 dark:text-white"${_scopeId}>Message details</h3></div><button type="button" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></div><div class="mt-4 space-y-3"${_scopeId}><div class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}><div${_scopeId}><span class="font-semibold"${_scopeId}>Email:</span> ${ssrInterpolate(selected.value.data?.from_email || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Phone:</span> ${ssrInterpolate(selected.value.data?.phone || "—")}</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Listing:</span>`);
                if (selected.value.listing?.id) {
                  _push3(ssrRenderComponent(unref(Link), {
                    href: `/listings/${selected.value.listing.id}`,
                    class: "text-primary-600 dark:text-primary-400 hover:underline"
                  }, {
                    default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(selected.value.listing.name)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(selected.value.listing.name), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push3(`<span${_scopeId}>—</span>`);
                }
                _push3(`</div><div${_scopeId}><span class="font-semibold"${_scopeId}>Received:</span> ${ssrInterpolate(new Date(selected.value.created_at).toLocaleString())}</div></div><div class="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words"${_scopeId}>${ssrInterpolate(selected.value.message_full || selected.value.data?.message || selected.value.data?.message_preview || "No message provided.")}</div></div><div class="mt-6 flex items-center justify-end gap-3"${_scopeId}><button class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"${_scopeId}> Close </button><button class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"${_scopeId}> Delete </button></div></div></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: !!pendingDelete.value,
              title: "Delete notification?",
              message: pendingDelete.value ? "This will remove the notification permanently." : "",
              "confirm-text": "Delete",
              "cancel-text": "Cancel",
              "onUpdate:show": ($event) => pendingDelete.value = null,
              onConfirm: confirmDestroy
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" }, [
                createVNode("div", { class: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6" }, [
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Notifications"),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "View and manage your messages.")
                    ])
                  ]),
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "min-w-full divide-y divide-gray-200 dark:divide-gray-800" }, [
                      createVNode("thead", { class: "bg-gray-50 dark:bg-gray-900/70" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200" }, "From"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200" }, "Listing"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200" }, "Message"),
                          createVNode("th", { class: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200" }, "Date"),
                          createVNode("th", { class: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200" }, "Actions")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-100 dark:divide-gray-800" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.notifications.data, (notification) => {
                          return openBlock(), createBlock("tr", {
                            key: notification.id,
                            class: "hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                          }, [
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("span", {
                                  class: ["inline-flex h-2 w-2 rounded-full", notification.read_at ? "bg-gray-300 dark:bg-gray-500" : "bg-primary-400"]
                                }, null, 2),
                                createVNode("div", null, [
                                  createVNode("div", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, toDisplayString(notification.data?.from_name || "New message"), 1),
                                  createVNode("div", { class: "text-xs text-gray-500 dark:text-gray-400" }, toDisplayString(notification.data?.from_email || "—"), 1)
                                ])
                              ])
                            ]),
                            createVNode("td", { class: "px-4 py-3 text-sm text-gray-700 dark:text-gray-200" }, [
                              notification.listing?.id ? (openBlock(), createBlock(unref(Link), {
                                key: 0,
                                href: `/listings/${notification.listing.id}`,
                                class: "text-primary-600 dark:text-primary-400 hover:underline"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(notification.listing.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-gray-500 dark:text-gray-400"
                              }, "—"))
                            ]),
                            createVNode("td", { class: "px-4 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs" }, toDisplayString(notification.data?.message_preview || notification.data?.message || "—"), 1),
                            createVNode("td", { class: "px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap" }, toDisplayString(new Date(notification.created_at).toLocaleString()), 1),
                            createVNode("td", { class: "px-4 py-3 text-right" }, [
                              createVNode("div", { class: "flex items-center justify-end gap-2" }, [
                                createVNode("button", {
                                  class: "px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600",
                                  onClick: ($event) => open(notification)
                                }, " View ", 8, ["onClick"]),
                                createVNode("button", {
                                  class: "px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40",
                                  onClick: ($event) => destroyNotification(notification)
                                }, " Delete ", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  __props.notifications.links?.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-6 flex flex-wrap gap-2 justify-center"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.notifications.links, (link) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: link.label,
                        href: link.url || "#",
                        "preserve-scroll": "",
                        innerHTML: link.label,
                        class: [
                          "px-3 py-2 text-sm rounded-lg border",
                          link.active ? "bg-primary-500 text-white border-primary-500" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        ]
                      }, null, 8, ["href", "innerHTML", "class"]);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ]),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                selected.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 z-50 flex items-center justify-center px-4"
                }, [
                  createVNode("div", {
                    class: "absolute inset-0 bg-black/60 backdrop-blur-sm",
                    onClick: close
                  }),
                  createVNode("div", { class: "relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6" }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "From " + toDisplayString(selected.value.data?.from_name || "New message"), 1),
                        createVNode("h3", { class: "text-xl font-semibold text-gray-900 dark:text-white" }, "Message details")
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                        onClick: close
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ]))
                      ])
                    ]),
                    createVNode("div", { class: "mt-4 space-y-3" }, [
                      createVNode("div", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Email:"),
                          createTextVNode(" " + toDisplayString(selected.value.data?.from_email || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Phone:"),
                          createTextVNode(" " + toDisplayString(selected.value.data?.phone || "—"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Listing:"),
                          selected.value.listing?.id ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: `/listings/${selected.value.listing.id}`,
                            class: "text-primary-600 dark:text-primary-400 hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selected.value.listing.name), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "font-semibold" }, "Received:"),
                          createTextVNode(" " + toDisplayString(new Date(selected.value.created_at).toLocaleString()), 1)
                        ])
                      ]),
                      createVNode("div", { class: "border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words" }, toDisplayString(selected.value.message_full || selected.value.data?.message || selected.value.data?.message_preview || "No message provided."), 1)
                    ]),
                    createVNode("div", { class: "mt-6 flex items-center justify-end gap-3" }, [
                      createVNode("button", {
                        class: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                        onClick: close
                      }, " Close "),
                      createVNode("button", {
                        class: "px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40",
                        onClick: ($event) => destroyNotification(selected.value)
                      }, " Delete ", 8, ["onClick"])
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ])),
              createVNode(_sfc_main$o, {
                show: !!pendingDelete.value,
                title: "Delete notification?",
                message: pendingDelete.value ? "This will remove the notification permanently." : "",
                "confirm-text": "Delete",
                "cancel-text": "Cancel",
                "onUpdate:show": ($event) => pendingDelete.value = null,
                onConfirm: confirmDestroy
              }, null, 8, ["show", "message", "onUpdate:show"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Notifications/Index.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    listing: Object
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      name: "",
      description: "",
      uploaded_images: []
    });
    const submit = () => {
      form.post(`/listings/${props.listing.id}/portfolios`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0"${_scopeId}><div class="flex flex-wrap items-start justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Create New Portfolio</h1><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}> For: <span class="font-medium"${_scopeId}>${ssrInterpolate(__props.listing.company_name)}</span></p></div></div><form class="grid grid-cols-1 gap-6 lg:grid-cols-3"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Portfolio Details</h2><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Portfolio Name * </label><input${ssrRenderAttr("value", unref(form).name)} type="text" required placeholder="e.g., Smith Wedding 2024" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Description </label>`);
            _push2(ssrRenderComponent(_sfc_main$b, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              placeholder: "Add some details about this portfolio..."
            }, null, _parent2, _scopeId));
            if (unref(form).errors.description) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Images</h2><span class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Up to 50 images</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$d, {
              modelValue: unref(form).uploaded_images,
              "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
              "max-images": 50,
              purpose: "portfolio"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.uploaded_images) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.uploaded_images)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.listing.id}/portfolios`,
              class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Creating...</span>`);
            } else {
              _push2(`<span${_scopeId}>Create Portfolio</span>`);
            }
            _push2(`</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0" }, [
                createVNode("div", { class: "flex flex-wrap items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Create New Portfolio"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(" For: "),
                      createVNode("span", { class: "font-medium" }, toDisplayString(__props.listing.company_name), 1)
                    ])
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "grid grid-cols-1 gap-6 lg:grid-cols-3"
                }, [
                  createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Portfolio Details"),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Portfolio Name * "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          type: "text",
                          required: "",
                          placeholder: "e.g., Smith Wedding 2024",
                          class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).name]
                        ]),
                        unref(form).errors.name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Description "),
                        createVNode(_sfc_main$b, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Add some details about this portfolio..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Images"),
                        createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Up to 50 images")
                      ]),
                      createVNode(_sfc_main$d, {
                        modelValue: unref(form).uploaded_images,
                        "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
                        "max-images": 50,
                        purpose: "portfolio"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(form).errors.uploaded_images ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.uploaded_images), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end" }, [
                    createVNode(unref(Link), {
                      href: `/listings/${__props.listing.id}/portfolios`,
                      class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Creating...")) : (openBlock(), createBlock("span", { key: 1 }, "Create Portfolio"))
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Portfolios/Create.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    portfolio: Object
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      name: props.portfolio.name,
      description: props.portfolio.description || "",
      uploaded_images: [],
      remove_images: []
    });
    const removedImageIds = ref([]);
    const handleRemoveExisting = (imageId) => {
      removedImageIds.value.push(imageId);
      form.remove_images = removedImageIds.value;
    };
    const submit = () => {
      form.transform((data) => ({
        ...data,
        _method: "PUT"
      })).post(`/portfolios/${props.portfolio.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0"${_scopeId}><div class="flex flex-wrap items-start justify-between gap-3"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Edit Portfolio</h1><p class="text-sm text-gray-600 dark:text-gray-300"${_scopeId}> For: `);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.portfolio.listing.id}`,
              class: "text-blue-600 dark:text-blue-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.portfolio.listing.company_name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.portfolio.listing.company_name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div></div><form class="grid grid-cols-1 gap-6 lg:grid-cols-3"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Portfolio Details</h2><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Portfolio Name * </label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}> Description </label>`);
            _push2(ssrRenderComponent(_sfc_main$b, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              placeholder: "Add some details about this portfolio..."
            }, null, _parent2, _scopeId));
            if (unref(form).errors.description) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="space-y-6"${_scopeId}><div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Images</h2><span class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>Up to 50 images</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$d, {
              modelValue: unref(form).uploaded_images,
              "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
              "existing-images": __props.portfolio.images,
              "max-images": 50,
              purpose: "portfolio",
              onRemoveExisting: handleRemoveExisting
            }, null, _parent2, _scopeId));
            if (unref(form).errors.uploaded_images) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.uploaded_images)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/portfolios/${__props.portfolio.id}`,
              class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Saving...</span>`);
            } else {
              _push2(`<span${_scopeId}>Save Changes</span>`);
            }
            _push2(`</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto mt-10 max-w-6xl space-y-6 px-4 sm:px-0" }, [
                createVNode("div", { class: "flex flex-wrap items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Edit Portfolio"),
                    createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-300" }, [
                      createTextVNode(" For: "),
                      createVNode(unref(Link), {
                        href: `/listings/${__props.portfolio.listing.id}`,
                        class: "text-blue-600 dark:text-blue-400 hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.portfolio.listing.company_name), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "grid grid-cols-1 gap-6 lg:grid-cols-3"
                }, [
                  createVNode("div", { class: "lg:col-span-2 space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Portfolio Details"),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Portfolio Name * "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          type: "text",
                          required: "",
                          class: "w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).name]
                        ]),
                        unref(form).errors.name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 dark:text-gray-200" }, " Description "),
                        createVNode(_sfc_main$b, {
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "Add some details about this portfolio..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Images"),
                        createVNode("span", { class: "text-xs text-gray-500 dark:text-gray-400" }, "Up to 50 images")
                      ]),
                      createVNode(_sfc_main$d, {
                        modelValue: unref(form).uploaded_images,
                        "onUpdate:modelValue": ($event) => unref(form).uploaded_images = $event,
                        "existing-images": __props.portfolio.images,
                        "max-images": 50,
                        purpose: "portfolio",
                        onRemoveExisting: handleRemoveExisting
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "existing-images"]),
                      unref(form).errors.uploaded_images ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.uploaded_images), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "lg:col-span-3 flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-end" }, [
                    createVNode(unref(Link), {
                      href: `/portfolios/${__props.portfolio.id}`,
                      class: "rounded-md px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Cancel ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Saving...")) : (openBlock(), createBlock("span", { key: 1 }, "Save Changes"))
                    ], 8, ["disabled"])
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Portfolios/Edit.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    listing: Object
  },
  setup(__props) {
    const pendingDelete = ref(null);
    const promptDelete = (portfolio) => {
      pendingDelete.value = portfolio;
    };
    const deletePortfolio = () => {
      if (!pendingDelete.value) {
        return;
      }
      router.delete(`/portfolios/${pendingDelete.value.id}`, {
        onFinish: () => {
          pendingDelete.value = null;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto px-4 sm:px-0"${_scopeId}><div class="mt-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"${_scopeId}><div class="flex justify-between items-start mb-6"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Portfolios</h1><p class="text-gray-600 dark:text-gray-300 mt-1"${_scopeId}> For: `);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.listing.id}/edit`,
              class: "font-medium text-primary-600 dark:text-primary-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.listing.company_name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.listing.company_name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.listing.id}/portfolios/create`,
              class: "inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId2}></path></svg> Add Portfolio `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Add Portfolio ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.listing.portfolios?.length === 0) {
              _push2(`<div class="text-center py-12"${_scopeId}><svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"${_scopeId}>No portfolios yet</h3><p class="text-gray-500 dark:text-gray-400 mb-6"${_scopeId}>Create your first portfolio to showcase your work.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/listings/${__props.listing.id}/portfolios/create`,
                class: "inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Create Your First Portfolio `);
                  } else {
                    return [
                      createTextVNode(" Create Your First Portfolio ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.listing.portfolios, (portfolio) => {
                _push2(`<div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md hover:shadow-primary-500/10 transition-shadow bg-white dark:bg-gray-800"${_scopeId}><div class="aspect-video bg-gray-100 dark:bg-gray-800 relative"${_scopeId}>`);
                if (portfolio.images?.[0]) {
                  _push2(`<img${ssrRenderAttr("src", portfolio.images[0].url)}${ssrRenderAttr("alt", portfolio.name)} class="w-full h-full object-cover"${_scopeId}>`);
                } else {
                  _push2(`<div class="w-full h-full flex items-center justify-center"${_scopeId}><svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg></div>`);
                }
                _push2(`</div><div class="p-4"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white mb-1"${_scopeId}>${ssrInterpolate(portfolio.name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400 mb-4"${_scopeId}>${ssrInterpolate(portfolio.images?.length || 0)} images </p><div class="flex gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/portfolios/${portfolio.id}/edit`,
                  class: "flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"${_scopeId}> Delete </button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`<div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/dashboard",
              class: "text-primary-600 dark:text-primary-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ← Back to Dashboard `);
                } else {
                  return [
                    createTextVNode(" ← Back to Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: !!pendingDelete.value,
              title: "Delete portfolio?",
              message: pendingDelete.value ? `Deleting ${pendingDelete.value.name} will remove its images. This cannot be undone.` : "",
              "confirm-text": "Delete",
              "cancel-text": "Cancel",
              "onUpdate:show": ($event) => pendingDelete.value = null,
              onConfirm: deletePortfolio
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto px-4 sm:px-0" }, [
                createVNode("div", { class: "mt-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm" }, [
                  createVNode("div", { class: "flex justify-between items-start mb-6" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Portfolios"),
                      createVNode("p", { class: "text-gray-600 dark:text-gray-300 mt-1" }, [
                        createTextVNode(" For: "),
                        createVNode(unref(Link), {
                          href: `/listings/${__props.listing.id}/edit`,
                          class: "font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.listing.company_name), 1)
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ])
                    ]),
                    createVNode(unref(Link), {
                      href: `/listings/${__props.listing.id}/portfolios/create`,
                      class: "inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 4v16m8-8H4"
                          })
                        ])),
                        createTextVNode(" Add Portfolio ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  __props.listing.portfolios?.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-12"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      })
                    ])),
                    createVNode("h3", { class: "text-lg font-medium text-gray-900 dark:text-white mb-2" }, "No portfolios yet"),
                    createVNode("p", { class: "text-gray-500 dark:text-gray-400 mb-6" }, "Create your first portfolio to showcase your work."),
                    createVNode(unref(Link), {
                      href: `/listings/${__props.listing.id}/portfolios/create`,
                      class: "inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Create Your First Portfolio ")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "grid grid-cols-1 md:grid-cols-2 gap-6"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.listing.portfolios, (portfolio) => {
                      return openBlock(), createBlock("div", {
                        key: portfolio.id,
                        class: "border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md hover:shadow-primary-500/10 transition-shadow bg-white dark:bg-gray-800"
                      }, [
                        createVNode("div", { class: "aspect-video bg-gray-100 dark:bg-gray-800 relative" }, [
                          portfolio.images?.[0] ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: portfolio.images[0].url,
                            alt: portfolio.name,
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-full h-full flex items-center justify-center"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-12 h-12 text-gray-300 dark:text-gray-600",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              })
                            ]))
                          ]))
                        ]),
                        createVNode("div", { class: "p-4" }, [
                          createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white mb-1" }, toDisplayString(portfolio.name), 1),
                          createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mb-4" }, toDisplayString(portfolio.images?.length || 0) + " images ", 1),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(unref(Link), {
                              href: `/portfolios/${portfolio.id}/edit`,
                              class: "flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Edit ")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode("button", {
                              onClick: ($event) => promptDelete(portfolio),
                              class: "px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            }, " Delete ", 8, ["onClick"])
                          ])
                        ])
                      ]);
                    }), 128))
                  ])),
                  createVNode("div", { class: "mt-8 pt-6 border-t border-gray-200 dark:border-gray-800" }, [
                    createVNode(unref(Link), {
                      href: "/dashboard",
                      class: "text-primary-600 dark:text-primary-400 hover:underline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" ← Back to Dashboard ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode(_sfc_main$o, {
                show: !!pendingDelete.value,
                title: "Delete portfolio?",
                message: pendingDelete.value ? `Deleting ${pendingDelete.value.name} will remove its images. This cannot be undone.` : "",
                "confirm-text": "Delete",
                "cancel-text": "Cancel",
                "onUpdate:show": ($event) => pendingDelete.value = null,
                onConfirm: deletePortfolio
              }, null, 8, ["show", "message", "onUpdate:show"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Portfolios/Index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    portfolio: Object,
    canManage: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const pendingDelete = ref(false);
    const deletePortfolio = () => {
      router.delete(`/portfolios/${props.portfolio.id}`, {
        onFinish: () => {
          pendingDelete.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto px-4 sm:px-0"${_scopeId}><div class="mt-12 flex justify-between items-start mb-6"${_scopeId}><div${_scopeId}><h1 class="text-3xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.portfolio.name)}</h1><p class="text-gray-600 dark:text-gray-300 mt-1"${_scopeId}> From: `);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.portfolio.listing.id}`,
              class: "text-blue-600 dark:text-blue-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.portfolio.listing.company_name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.portfolio.listing.company_name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div>`);
            if (__props.canManage) {
              _push2(`<div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/portfolios/${__props.portfolio.id}/edit`,
                class: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Edit `);
                  } else {
                    return [
                      createTextVNode(" Edit ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"${_scopeId}> Delete </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.portfolio.description) {
              _push2(`<div class="bg-white prose-lg dark:bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-800"${_scopeId}><p class="text-gray-700 dark:text-gray-200 whitespace-pre-line"${_scopeId}>${__props.portfolio.description ?? ""}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.portfolio.images?.length > 0) {
              _push2(`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4"${_scopeId}>${ssrInterpolate(__props.portfolio.images.length)} Images </h2>`);
              _push2(ssrRenderComponent(_sfc_main$7, {
                images: __props.portfolio.images
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"${_scopeId}> No images in this portfolio yet. `);
              if (__props.canManage) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/portfolios/${__props.portfolio.id}/edit`,
                  class: "text-blue-600 dark:text-blue-400 hover:underline ml-1"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Add some images `);
                    } else {
                      return [
                        createTextVNode(" Add some images ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`<div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: `/listings/${__props.portfolio.listing.id}`,
              class: "text-blue-600 dark:text-blue-400 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ← Back to ${ssrInterpolate(__props.portfolio.listing.company_name)}`);
                } else {
                  return [
                    createTextVNode(" ← Back to " + toDisplayString(__props.portfolio.listing.company_name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$o, {
              show: __props.canManage && pendingDelete.value,
              title: "Delete portfolio?",
              message: "This will remove the portfolio and its images. This cannot be undone.",
              "confirm-text": "Delete",
              "cancel-text": "Cancel",
              "onUpdate:show": ($event) => pendingDelete.value = $event,
              onConfirm: deletePortfolio
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto px-4 sm:px-0" }, [
                createVNode("div", { class: "mt-12 flex justify-between items-start mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900 dark:text-white" }, toDisplayString(__props.portfolio.name), 1),
                    createVNode("p", { class: "text-gray-600 dark:text-gray-300 mt-1" }, [
                      createTextVNode(" From: "),
                      createVNode(unref(Link), {
                        href: `/listings/${__props.portfolio.listing.id}`,
                        class: "text-blue-600 dark:text-blue-400 hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.portfolio.listing.company_name), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ]),
                  __props.canManage ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex gap-2"
                  }, [
                    createVNode(unref(Link), {
                      href: `/portfolios/${__props.portfolio.id}/edit`,
                      class: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Edit ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode("button", {
                      onClick: ($event) => pendingDelete.value = true,
                      class: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    }, " Delete ", 8, ["onClick"])
                  ])) : createCommentVNode("", true)
                ]),
                __props.portfolio.description ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-white prose-lg dark:bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-800"
                }, [
                  createVNode("p", {
                    class: "text-gray-700 dark:text-gray-200 whitespace-pre-line",
                    innerHTML: __props.portfolio.description
                  }, null, 8, ["innerHTML"])
                ])) : createCommentVNode("", true),
                __props.portfolio.images?.length > 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800"
                }, [
                  createVNode("h2", { class: "text-xl font-semibold text-gray-900 dark:text-white mb-4" }, toDisplayString(__props.portfolio.images.length) + " Images ", 1),
                  createVNode(_sfc_main$7, {
                    images: __props.portfolio.images
                  }, null, 8, ["images"])
                ])) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                }, [
                  createTextVNode(" No images in this portfolio yet. "),
                  __props.canManage ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: `/portfolios/${__props.portfolio.id}/edit`,
                    class: "text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add some images ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ])),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(unref(Link), {
                    href: `/listings/${__props.portfolio.listing.id}`,
                    class: "text-blue-600 dark:text-blue-400 hover:underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ← Back to " + toDisplayString(__props.portfolio.listing.company_name), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])
              ]),
              createVNode(_sfc_main$o, {
                show: __props.canManage && pendingDelete.value,
                title: "Delete portfolio?",
                message: "This will remove the portfolio and its images. This cannot be undone.",
                "confirm-text": "Delete",
                "cancel-text": "Cancel",
                "onUpdate:show": ($event) => pendingDelete.value = $event,
                onConfirm: deletePortfolio
              }, null, 8, ["show", "onUpdate:show"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Portfolios/Show.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    existingRequest: Object
  },
  setup(__props) {
    const page = usePage();
    const props = __props;
    const form = useForm({
      business_name: props.existingRequest?.business_name || "",
      legal_entity_type: props.existingRequest?.legal_entity_type || "",
      registration_number: props.existingRequest?.registration_number || "",
      registration_state: props.existingRequest?.registration_state || "",
      business_address: props.existingRequest?.business_address || "",
      owner_name: props.existingRequest?.owner_name || page.props.auth?.user?.name || "",
      owner_email: props.existingRequest?.owner_email || page.props.auth?.user?.email || "",
      owner_phone: props.existingRequest?.owner_phone || "",
      website: props.existingRequest?.website || "",
      bbb_profile_url: props.existingRequest?.bbb_profile_url || ""
    });
    const hasPending = ["pending", "in_review"].includes(props.existingRequest?.status);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$r, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"${_scopeId}><div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6"${_scopeId}><div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"${_scopeId}>Verification</p><h1 class="text-2xl font-bold text-gray-900 dark:text-white"${_scopeId}>Submit verification</h1><p class="text-gray-600 dark:text-gray-300 mt-1"${_scopeId}>Provide business details so we can verify your listings.</p></div>`);
            if (__props.existingRequest) {
              _push2(`<div class="${ssrRenderClass([{
                "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800": __props.existingRequest.status === "pending" || __props.existingRequest.status === "in_review",
                "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800": __props.existingRequest.status === "approved",
                "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800": __props.existingRequest.status === "rejected"
              }, "px-3 py-1 rounded-full text-xs font-semibold border"])}"${_scopeId}>${ssrInterpolate(__props.existingRequest.status?.replace("_", " "))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.existingRequest?.admin_notes) {
              _push2(`<div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200"${_scopeId}><p class="font-semibold mb-1"${_scopeId}>Reviewer notes</p><p${_scopeId}>${ssrInterpolate(__props.existingRequest.admin_notes)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Business name *</label><input${ssrRenderAttr("value", unref(form).business_name)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.business_name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.business_name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Legal entity type</label><input${ssrRenderAttr("value", unref(form).legal_entity_type)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="LLC, Corp, Sole Prop"${_scopeId}>`);
            if (unref(form).errors.legal_entity_type) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.legal_entity_type)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Registration number</label><input${ssrRenderAttr("value", unref(form).registration_number)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.registration_number) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.registration_number)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Registration state</label><input${ssrRenderAttr("value", unref(form).registration_state)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.registration_state) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.registration_state)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Business address</label><input${ssrRenderAttr("value", unref(form).business_address)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.business_address) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.business_address)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Owner name *</label><input${ssrRenderAttr("value", unref(form).owner_name)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.owner_name) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.owner_name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Owner email *</label><input${ssrRenderAttr("value", unref(form).owner_email)} type="email"${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.owner_email) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.owner_email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Owner phone</label><input${ssrRenderAttr("value", unref(form).owner_phone)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.owner_phone) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.owner_phone)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>Website</label><input${ssrRenderAttr("value", unref(form).website)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>`);
            if (unref(form).errors.website) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.website)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium text-gray-700 dark:text-gray-200"${_scopeId}>BBB profile URL</label><input${ssrRenderAttr("value", unref(form).bbb_profile_url)}${ssrIncludeBooleanAttr(unref(hasPending)) ? " disabled" : ""} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://www.bbb.org/..."${_scopeId}>`);
            if (unref(form).errors.bbb_profile_url) {
              _push2(`<p class="text-sm text-red-500"${_scopeId}>${ssrInterpolate(unref(form).errors.bbb_profile_url)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/dashboard",
              class: "text-sm text-gray-700 dark:text-gray-300 hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || unref(hasPending)) ? " disabled" : ""} class="px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Submitting...</span>`);
            } else if (unref(hasPending)) {
              _push2(`<span${_scopeId}>Under review</span>`);
            } else {
              _push2(`<span${_scopeId}>Submit for verification</span>`);
            }
            _push2(`</button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" }, [
                createVNode("div", { class: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400" }, "Verification"),
                      createVNode("h1", { class: "text-2xl font-bold text-gray-900 dark:text-white" }, "Submit verification"),
                      createVNode("p", { class: "text-gray-600 dark:text-gray-300 mt-1" }, "Provide business details so we can verify your listings.")
                    ]),
                    __props.existingRequest ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: ["px-3 py-1 rounded-full text-xs font-semibold border", {
                        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800": __props.existingRequest.status === "pending" || __props.existingRequest.status === "in_review",
                        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800": __props.existingRequest.status === "approved",
                        "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800": __props.existingRequest.status === "rejected"
                      }]
                    }, toDisplayString(__props.existingRequest.status?.replace("_", " ")), 3)) : createCommentVNode("", true)
                  ]),
                  __props.existingRequest?.admin_notes ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200"
                  }, [
                    createVNode("p", { class: "font-semibold mb-1" }, "Reviewer notes"),
                    createVNode("p", null, toDisplayString(__props.existingRequest.admin_notes), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("form", {
                    class: "space-y-6",
                    onSubmit: withModifiers(($event) => unref(form).post("/verification"), ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Business name *"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).business_name = $event,
                          disabled: unref(hasPending),
                          required: "",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).business_name]
                        ]),
                        unref(form).errors.business_name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.business_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Legal entity type"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).legal_entity_type = $event,
                          disabled: unref(hasPending),
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500",
                          placeholder: "LLC, Corp, Sole Prop"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).legal_entity_type]
                        ]),
                        unref(form).errors.legal_entity_type ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.legal_entity_type), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Registration number"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).registration_number = $event,
                          disabled: unref(hasPending),
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).registration_number]
                        ]),
                        unref(form).errors.registration_number ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.registration_number), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Registration state"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).registration_state = $event,
                          disabled: unref(hasPending),
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).registration_state]
                        ]),
                        unref(form).errors.registration_state ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.registration_state), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Business address"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).business_address = $event,
                        disabled: unref(hasPending),
                        class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, unref(form).business_address]
                      ]),
                      unref(form).errors.business_address ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.business_address), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Owner name *"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).owner_name = $event,
                          disabled: unref(hasPending),
                          required: "",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).owner_name]
                        ]),
                        unref(form).errors.owner_name ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.owner_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Owner email *"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).owner_email = $event,
                          type: "email",
                          disabled: unref(hasPending),
                          required: "",
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).owner_email]
                        ]),
                        unref(form).errors.owner_email ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.owner_email), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Owner phone"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).owner_phone = $event,
                          disabled: unref(hasPending),
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).owner_phone]
                        ]),
                        unref(form).errors.owner_phone ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.owner_phone), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "Website"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).website = $event,
                          disabled: unref(hasPending),
                          class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelText, unref(form).website]
                        ]),
                        unref(form).errors.website ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.website), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium text-gray-700 dark:text-gray-200" }, "BBB profile URL"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).bbb_profile_url = $event,
                        disabled: unref(hasPending),
                        class: "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500",
                        placeholder: "https://www.bbb.org/..."
                      }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, unref(form).bbb_profile_url]
                      ]),
                      unref(form).errors.bbb_profile_url ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.bbb_profile_url), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end" }, [
                      createVNode(unref(Link), {
                        href: "/dashboard",
                        class: "text-sm text-gray-700 dark:text-gray-300 hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing || unref(hasPending),
                        class: "px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Submitting...")) : unref(hasPending) ? (openBlock(), createBlock("span", { key: 1 }, "Under review")) : (openBlock(), createBlock("span", { key: 2 }, "Submit for verification"))
                      ], 8, ["disabled"])
                    ])
                  ], 40, ["onSubmit"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Verification/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Admin/Flags/Index.vue": __vite_glob_0_0, "./Pages/Admin/Verification/Index.vue": __vite_glob_0_1, "./Pages/Admin/Verification/Show.vue": __vite_glob_0_2, "./Pages/Auth/Login.vue": __vite_glob_0_3, "./Pages/Auth/Register.vue": __vite_glob_0_4, "./Pages/Dashboard.vue": __vite_glob_0_5, "./Pages/Home.vue": __vite_glob_0_6, "./Pages/Legal/Privacy.vue": __vite_glob_0_7, "./Pages/Legal/Terms.vue": __vite_glob_0_8, "./Pages/Listings/Create.vue": __vite_glob_0_9, "./Pages/Listings/Edit.vue": __vite_glob_0_10, "./Pages/Listings/PublicShow.vue": __vite_glob_0_11, "./Pages/Listings/Show.vue": __vite_glob_0_12, "./Pages/Notifications/Index.vue": __vite_glob_0_13, "./Pages/Portfolios/Create.vue": __vite_glob_0_14, "./Pages/Portfolios/Edit.vue": __vite_glob_0_15, "./Pages/Portfolios/Index.vue": __vite_glob_0_16, "./Pages/Portfolios/Show.vue": __vite_glob_0_17, "./Pages/Verification/Create.vue": __vite_glob_0_18 });
      return pages[`./Pages/${name}.vue`];
    },
    setup({ App, props, plugin }) {
      return createSSRApp({
        render: () => h(App, props)
      }).use(plugin);
    }
  })
);
