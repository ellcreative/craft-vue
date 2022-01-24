<template>
  <div>
    <form v-if="initialized" class="form">
      <transition name="fade" mode="out-in">
        <template v-for="(page, p) in form.pages">
          <div v-if="pageCurrent === p" :key="p" class="form__page" :data-page="p">
            <div v-for="(row, r) in page.rows" :key="r" class="form__row" :data-page="r">
              <div v-for="(column, c) in row.columns" :key="c" class="form__column" :data-page="c">
                <template v-if="column.type === 'submit'">
                  <template v-if="p !== 0 && !column.disablePrev">
                    <FormulateInput
                      ref="inputs"
                      v-model="form.data[column.handle]"
                      :disabled="submitting || submitted"
                      v-bind="columnProps(column, 'button', 'labelPrev')"
                      @click="prevPage"
                    />
                  </template>
                  <template v-if="p < form.pages.length - 1">
                    <FormulateInput
                      ref="inputs"
                      v-model="form.data[column.handle]"
                      :disabled="submitting || submitted"
                      v-bind="columnProps(column, 'button', 'labelNext')"
                      @click="nextPage"
                    />
                  </template>
                  <template v-else>
                    <div v-if="submitted" class="submitted">
                      <p>Thank You, We'll Be In Touch</p>
                    </div>
                    <FormulateInput
                      v-else
                      ref="inputs"
                      v-model="form.data[column.handle]"
                      :disabled="submitting || submitted"
                      v-bind="columnProps(column, 'button', 'labelNext')"
                      @click.prevent="submit"
                    />
                  </template>
                </template>
                <template v-else-if="column.type === 'dynamic_recipients'">
                  <FormulateInput
                    ref="inputs"
                    v-model="form.data[column.handle]"
                    :disabled="submitting || submitted"
                    v-bind="
                      columnProps(
                        column,
                        column.showAsRadio ? 'radio' : column.showAsCheckboxes ? 'checkbox' : 'select',
                      )
                    "
                    @hook:mounted="
                      inputMounted(
                        column.hash,
                        column.showAsRadio ? 'radio' : column.showAsCheckboxes ? 'checkbox' : 'select',
                      )
                    "
                  />
                </template>
                <template v-else>
                  <FormulateInput
                    ref="inputs"
                    v-model="form.data[column.handle]"
                    :disabled="submitting || submitted"
                    v-bind="columnProps(column)"
                    @hook:mounted="inputMounted(column.hash, column.type)"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
      </transition>
    </form>
    <div v-else-if="formError" class="error">
      <h1>Error Loading Form</h1>
      <p>{{ formError }}</p>
    </div>
    <div v-else-if="!initialized">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    formHandle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      initialized: false,
      submitting: false,
      submitted: false,
      pageCurrent: 0,
      form: { pages: [], data: {} },
      formError: '',
      choices: [],
    }
  },
  computed: {
    pageMax() {
      return this.form.pages.length - 1
    },
  },
  created() {
    this.loadForm(this.formHandle)
  },
  methods: {
    async loadForm(formHandle) {
      try {
        const formLayout = await this.$axios.$post('/get-form-layout', {
          [this.$csrf.name]: this.$csrf.value,
          formHandle,
        })
        if (formLayout.length !== 0) {
          this.form = this.$parseForm(formLayout)
          this.initialized = true
          this.restoreFormProgress()
        }
      } catch (e) {
        this.formError = e.response.data.error
      }
    },
    inputMounted(hash, type) {
      if (this.$choices && type === 'select') {
        this.$nextTick(() => {
          const el = this.$el.querySelector(`[data-hash="${hash}"]`)
          if (el && el.dataset?.choice === undefined) {
            const choice = new this.$choices(el, {
              position: 'down',
              shouldSort: false,
              searchEnabled: false,
              itemSelectText: '',
            })
            this.choices.push(choice)
          }
        })
      }
    },
    restoreFormProgress() {
      if (process.browser) {
        const pageId = localStorage.getItem(`form:page:${this.formHandle}`) || 0
        const formJson = localStorage.getItem(`form:data:${this.formHandle}`)

        if (formJson) {
          this.pageCurrent = Number(pageId)
          const formData = JSON.parse(formJson)
          for (const key of Object.keys(formData)) {
            this.form.data[key] = formData[key]
          }
        }
      }
    },
    storeProgress() {
      if (process.browser) {
        localStorage.setItem(`form:page:${this.formHandle}`, this.pageCurrent)
        localStorage.setItem(`form:data:${this.formHandle}`, JSON.stringify(this.form.data))
      }
    },
    clearProgress() {
      if (process.browser) {
        localStorage.removeItem(`form:page:${this.formHandle}`)
        localStorage.removeItem(`form:data:${this.formHandle}`)
      }
    },
    prevPage() {
      this.pageCurrent--
      this.pageCurrent = Math.max(this.pageCurrent, 0)
      this.storeProgress()
    },
    nextPage() {
      this.pageCurrent++
      this.pageCurrent = Math.min(this.pageCurrent, this.pageMax)
      this.storeProgress()
    },
    async submit() {
      this.storeProgress()

      let validates = true
      for (const input of this.$refs.inputs) {
        if (input.hasValidationErrors) {
          if (await input.hasValidationErrors()) {
            validates = false
            input.formShouldShowErrors = true
          }
        }
      }
      if (validates) {
        const formData = {
          formHash: this.form.hash,
          [this.$csrf.name]: this.$csrf.value,
          ...this.form.data,
        }
        try {
          this.submitting = true
          await this.$axios.$post('/form', formData, {
            headers: {
              // For CraftCMS to detect isAjax properly.
              'X-Requested-With': 'XMLHttpRequest',
            },
          })
          this.clearProgress()
          this.submitted = true
        } catch (err) {
          // console.error(err)
        }
      }
    },
    columnProps(column, type = false, label = 'label') {
      return {
        'data-hash': column.hash,
        type: type !== false ? type : this.getType(column.type),
        name: column[label],
        label: column[label],
        options: column.options,
        validation: this.getValidation(column),
        validationMessages: this.getValidationMessages(column),
        placeholder: column.placeholder,
        checked: column.checked,
        help: column.instructions,
      }
    },
    getType(type) {
      switch (type) {
        case 'regex':
          return 'text'
        case 'checkbox_group':
          return 'checkbox'
        case 'radio_group':
          return 'radio'
        default:
          return type
      }
    },
    getValidation(field) {
      const validation = []
      if (field.required) {
        validation.push('required')
      }
      if (field.type === 'email') {
        validation.push('email')
      }
      if (field.type === 'number') {
        validation.push('number')
      }
      if (field.minValue !== field.maxValue) {
        if (field.minValue < field.maxValue) {
          validation.push(`min:${field.minValue},value`)
          validation.push(`max:${field.maxValue},value`)
        } else if (field.minValue) {
          validation.push(`min:${field.minValue},value`)
        } else if (field.maxValue) {
          validation.push(`max:${field.maxValue},value`)
        }
      }
      if (field.minLength) {
        validation.push(`min:${field.minLength},length`)
      }
      if (field.maxLength) {
        validation.push(`max:${field.maxLength},length`)
      }
      if (field.pattern) {
        validation.push(`matches:${field.pattern}`)
      }
      if (validation.length === 0) {
        return false
      }
      return `^${validation.join('|')}`
    },
    getValidationMessages(field) {
      const validationMessages = {}
      if (field.pattern) {
        validationMessages.matches = field.message
      }
      return validationMessages
    },
  },
}
</script>

<style lang="scss">
.form {
  &__row {
    display: flex;
    flex-direction: column;
    @media (min-width: 43em) {
      flex-direction: row;
    }
  }
  &__column {
    flex-grow: 1;
    margin-right: 40px;
  }
}
[data-has-value] {
  .formulate-input-label {
    transform: none;
  }
}
.formulate-input {
  input,
  textarea {
    width: 100%;
  }
  ~ .formulate-input {
    margin-top: 16px;
  }
}
.formulate-input-errors {
  color: #e20122;
  padding-left: 0;
  list-style: none;
}
</style>
