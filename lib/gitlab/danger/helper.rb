# frozen_string_literal: true

require_relative 'teammate'

module Gitlab
  module Danger
    module Helper
      RELEASE_TOOLS_BOT = 'gitlab-release-tools-bot'

      # Returns a list of all files that have been added, modified or renamed.
      # `git.modified_files` might contain paths that already have been renamed,
      # so we need to remove them from the list.
      #
      # Considering these changes:
      #
      # - A new_file.rb
      # - D deleted_file.rb
      # - M modified_file.rb
      # - R renamed_file_before.rb -> renamed_file_after.rb
      #
      # it will return
      # ```
      # [ 'new_file.rb', 'modified_file.rb', 'renamed_file_after.rb' ]
      # ```
      #
      # @return [Array<String>]
      def all_changed_files
        Set.new
           .merge(git.added_files.to_a)
           .merge(git.modified_files.to_a)
           .merge(git.renamed_files.map { |x| x[:after] })
           .subtract(git.renamed_files.map { |x| x[:before] })
           .to_a
           .sort
      end

      def gitlab_helper
        # Unfortunately the following does not work:
        # - respond_to?(:gitlab)
        # - respond_to?(:gitlab, true)
        gitlab
      rescue NoMethodError
        nil
      end

      def release_automation?
        gitlab_helper&.mr_author == RELEASE_TOOLS_BOT
      end

      def markdown_list(items)
        list = items.map { |item| "* `#{item}`" }.join("\n")

        if items.size > 10
          "\n<details>\n\n#{list}\n\n</details>\n"
        else
          list
        end
      end

      # @return [Hash<String,Array<String>>]
      def changes_by_category
        all_changed_files.each_with_object(Hash.new { |h, k| h[k] = [] }) do |file, hash|
          hash[category_for_file(file)] << file
        end
      end

      # Determines the category a file is in, e.g., `:frontend` or `:backend`
      # @return[Symbol]
      def category_for_file(file)
        _, category = CATEGORIES.find { |regexp, _| regexp.match?(file) }

        category || :unknown
      end

      # Returns the GFM for a category label, making its best guess if it's not
      # a category we know about.
      #
      # @return[String]
      def label_for_category(category)
        CATEGORY_LABELS.fetch(category, "~#{category}")
      end

      CATEGORY_LABELS = {
        docs: '~documentation', # Docs are reviewed along DevOps stages, so don't need roulette for now.
        none: '',
        qa: '~QA',
        test: '~test ~Quality for `spec/features/*`',
        engineering_productivity: '~"Engineering Productivity" for CI, Danger'
      }.freeze
      CATEGORIES = {
        %r{\Adoc/} => :frontend,
        /\.md\z/ => :frontend,
        /\.(vue|js|scss)\z/ => :frontend,
        %r{(\A|/)(
          \.babelrc |
          \.eslintignore |
          \.eslintrc(\.yml)? |
          \.nvmrc |
          \.prettierignore |
          \.prettierrc |
          \.scss-lint.yml |
          \.stylelintrc |
          package\.json |
          yarn\.lock |
        )\z}x => :frontend,
        %r{\Atests/} => :frontend,

        /Dangerfile\z/ => :engineering_productivity,
        %r{\A(danger/|lib/gitlab[/_]danger)} => :engineering_productivity,

        # Files that don't fit into any category are marked with :none
        %r{\A(\.gitlab-ci\.yml\z|\.gitlab\/ci)} => :none,

        # Fallbacks in case the above patterns miss anything
        /\.rb\z/ => :backend
      }.freeze
    end
  end
end
