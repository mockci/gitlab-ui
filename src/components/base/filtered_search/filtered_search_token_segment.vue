<script>
import { Portal } from 'portal-vue';
import GlFilteredSearchSuggestionList from './filtered_search_suggestion_list.vue';
import GlFilteredSearchSuggestion from './filtered_search_suggestion.vue';
import { splitOnQuotes, wrapTokenInQuotes } from './filtered_search_utils';

export default {
  components: {
    Portal,
    GlFilteredSearchSuggestionList,
    GlFilteredSearchSuggestion,
  },
  inheritAttrs: false,
  inject: ['portalName', 'alignSuggestions'],
  props: {
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Array,
      required: false,
      default: () => null,
    },
    optionTextField: {
      type: String,
      required: false,
      default: 'value',
    },
    customInputKeydownHandler: {
      type: Function,
      required: false,
      default: () => () => false,
    },
    value: {
      required: true,
      validator: () => true,
    },
  },

  data() {
    return {
      fallbackValue: this.value,
    };
  },

  computed: {
    matchingOption() {
      return this.options?.find(o => o.value === this.value);
    },

    inputValue: {
      get() {
        return this.matchingOption ? this.matchingOption[this.optionTextField] : this.value;
      },

      set(v) {
        this.$emit('input', this.getMatchingOptionForInputValue(v)?.value ?? v);
      },
    },

    hasOptionsOrSuggestions() {
      return this.options?.length || this.$slots.suggestions;
    },

    defaultSuggestedValue() {
      if (!this.options) {
        return this.value;
      }
      if (this.value) {
        const match =
          this.getMatchingOptionForInputValue(this.inputValue) ||
          this.getMatchingOptionForInputValue(this.inputValue, { loose: true });
        return match?.value;
      }

      const defaultSuggestion = this.options.find(op => op.default);
      return (defaultSuggestion ?? this.options[0])?.value;
    },
  },

  watch: {
    active: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.activate();
        } else {
          this.deactivate();
        }
      },
    },

    inputValue(newValue) {
      const hasUnclosedQuote = newValue.split('"').length % 2 === 0;
      if (newValue.indexOf(' ') === -1 || hasUnclosedQuote) {
        return;
      }

      const [firstWord, ...otherWords] = splitOnQuotes(newValue).filter(
        (w, idx, arr) => Boolean(w) || idx === arr.length - 1
      );
      this.$emit('input', this.getMatchingOptionForInputValue(firstWord)?.value ?? firstWord);

      if (otherWords.length) {
        this.$emit('split', otherWords);
      }
    },
  },

  methods: {
    emitIfInactive(e) {
      if (!this.active) {
        this.$emit('activate');
        e.preventDefault();
      }
    },

    getMatchingOptionForInputValue(v, { loose } = { loose: false }) {
      return this.options?.find(o =>
        loose ? o[this.optionTextField].startsWith(v) : [this.optionTextField] === v
      );
    },

    activate() {
      this.fallbackValue = this.value;

      this.$nextTick(() => {
        const { input } = this.$refs;
        if (input) {
          input.focus();
          input.scrollIntoView({ block: 'nearest', inline: 'end' });
          this.alignSuggestions(input);
        }
      });
    },

    deactivate() {
      if (!this.options) {
        return;
      }

      if (this.matchingOption?.value !== this.value) {
        this.$emit('input', this.fallbackValue);
      }
    },

    applySuggestion(suggestedValue) {
      const formattedSuggestedValue = wrapTokenInQuotes(suggestedValue);

      this.$emit('input', formattedSuggestedValue);
      this.$emit('complete', formattedSuggestedValue);
    },

    handleInputKeydown(e) {
      const { key } = e;
      const { suggestions } = this.$refs;
      const suggestedValue = suggestions?.getValue();
      if (key === 'Backspace') {
        if (this.inputValue === '') {
          e.preventDefault();
          this.$emit('backspace');
        }
        return;
      }

      const handlers = {
        Enter: () => {
          if (suggestedValue != null) {
            this.applySuggestion(suggestedValue);
          } else {
            this.$emit('submit');
          }
        },
      };

      const suggestionsHandlers = {
        ArrowDown: () => suggestions.nextItem(),
        Down: () => suggestions.nextItem(),
        ArrowUp: () => suggestions.prevItem(),
        Up: () => suggestions.prevItem(),
      };

      if (this.hasOptionsOrSuggestions) {
        Object.assign(handlers, suggestionsHandlers);
      }

      if (Object.keys(handlers).includes(key)) {
        e.preventDefault();
        handlers[key]();
        return;
      }

      this.customInputKeydownHandler(e, {
        suggestedValue,
        inputValue: this.inputValue,
        applySuggestion: v => this.applySuggestion(v),
      });
    },

    handleBlur() {
      if (this.active) {
        this.$emit('deactivate');
      }
    },
  },
};
</script>

<template>
  <div
    class="gl-filtered-search-token-segment"
    :class="{ 'gl-filtered-search-token-segment-active': active }"
    @mousedown.left="emitIfInactive"
  >
    <template v-if="active">
      <input
        ref="input"
        v-model="inputValue"
        class="gl-filtered-search-token-segment-input"
        @keydown="handleInputKeydown"
        @blur="handleBlur"
      />
      <portal :key="`operator-${_uid}`" :to="portalName">
        <gl-filtered-search-suggestion-list
          v-if="hasOptionsOrSuggestions"
          :key="`operator-${_uid}`"
          ref="suggestions"
          :initial-value="defaultSuggestedValue"
          @suggestion="applySuggestion"
        >
          <template v-if="options">
            <gl-filtered-search-suggestion
              v-for="(option, idx) in options"
              :key="`${option.value}-${idx}`"
              :value="option.value"
              :icon-name="option.icon"
            >
              <slot name="option" v-bind="{ option }">
                {{ option[optionTextField] }}
              </slot>
            </gl-filtered-search-suggestion>
          </template>
          <slot v-else name="suggestions"></slot>
        </gl-filtered-search-suggestion-list>
      </portal>
    </template>

    <slot v-else name="view" v-bind="{ inputValue }">{{ inputValue }}</slot>
  </div>
</template>
