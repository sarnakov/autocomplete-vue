import autocomplete from "../src/js/autocomplete-vue.vue";

describe("Autocomplete", () => {
  it("should show placeholder text", () => {
    const vm = setup('placeholder="test"');
    const placeholder = vm.$el
      .querySelector("input")
      .getAttribute("placeholder");
    expect(placeholder).to.equal("test");
  });

  it("should set entries based on list", () => {
    const vm = setup('ref="autocomplete" :list="[{name: \'test\'}]"');
    const component = vm.$refs.autocomplete;
    expect(component.entries[0].name).to.equal("test");
  });

  it("should match search ignoreCase", () => {
    const vm = setup(
      ":ignoreCase=\"true\" ref=\"autocomplete\" :list=\"[{name: 'TEST'}, {name: 'test1'}, {name: 'tESt2'}]\""
    );
    const component = vm.$refs.autocomplete;
    component.search = "";
    expect(component.filteredEntries.length).to.equal(0);

    component.search = "test";
    expect(component.filteredEntries.length).to.equal(3);

    component.search = "test1";
    expect(component.filteredEntries.length).to.equal(1);

    component.search = "TeSt";
    expect(component.filteredEntries.length).to.equal(3);
  });

  it("should match search case sensitive", () => {
    const vm = setup(
      ":ignoreCase=\"false\" ref=\"autocomplete\" :list=\"[{name: 'TEST'}, {name: 'test1'}, {name: 'tESt2'}]\""
    );
    const component = vm.$refs.autocomplete;
    component.search = "";
    expect(component.filteredEntries.length).to.equal(0);

    component.search = "test";
    expect(component.filteredEntries.length).to.equal(1);

    component.search = "TEST";
    expect(component.filteredEntries.length).to.equal(1);

    component.search = "tESt";
    expect(component.filteredEntries.length).to.equal(1);
  });

  it("should v-model", () => {
    const vm = new Vue({
      template:
        '<autocomplete v-model="test" ref="autocomplete"></autocomplete>',
      data() {
        return {
          test: "start"
        };
      },
      components: {
        autocomplete: autocomplete
      }
    }).$mount();
    const component = vm.$refs.autocomplete;
    // Initial value
    expect(component.search).to.equal("start");

    // Set child value - change parent value
    component.search = "changed";
    vm.$nextTick(() => {
      expect(vm.test).to.equal("changed");
    });
  });

  it("should set property", () => {
    const vm = setup(
      'ref="autocomplete" property="test" :list="[{test: \'abc\'}]"'
    );
    const component = vm.$refs.autocomplete;
    component.search = "abc";
    expect(component.filteredEntries.length).to.equal(1);
  });

  it("should set classPrefix", () => {
    const vm = setup('classPrefix="test"');
    expect(vm.$el.className).to.equal("test");
  });

  it("should set inputClass", () => {
    const vm = setup('inputClass="test"');
    expect(vm.$el.querySelector("input").className).to.equal("test");
  });

  it("should set required", () => {
    let vm = setup(':required="true"');
    expect(vm.$el.querySelector("input").getAttribute("required")).to.equal(
      "required"
    );

    vm = setup(':required="false"');
    expect(vm.$el.querySelector("input").getAttribute("required")).to.not.equal(
      "required"
    );
  });

  it("should set threshold", () => {
    let vm = setup(
      ":threshold=\"0\" ref=\"autocomplete\" :list=\"[{name: 'aaa'}, {name: 'aaaa'}, {name: 'aaaaa'}]\""
    );
    let component = vm.$refs.autocomplete;
    component.search = "a";
    expect(component.filteredEntries.length).to.equal(3);
    component.search = "";
    expect(component.filteredEntries.length).to.equal(0);

    vm = setup(
      ":threshold=\"-1\" ref=\"autocomplete\" :list=\"[{name: 'aaa'}, {name: 'aaaa'}, {name: 'aaaaa'}]\""
    );
    component = vm.$refs.autocomplete;
    component.search = "";
    expect(component.filteredEntries.length).to.equal(3);

    vm = setup(
      ":threshold=\"1\" ref=\"autocomplete\" :list=\"[{name: 'aaa'}, {name: 'aaaa'}, {name: 'aaaaa'}]\""
    );
    component = vm.$refs.autocomplete;
    component.search = "aa";
    expect(component.filteredEntries.length).to.equal(3);
    component.search = "a";
    expect(component.filteredEntries.length).to.equal(0);
  });

  it("should set list from ajax", async function() {
    Vue.http.interceptors.push((request, next) => {
      request.method = "GET";
      next(response => {
        response.status = 200;
        response.data = [{ name: "getajaxtest" }];
        response.ok = 200;
      });
    });

    let vm = setup('url="/api/derp"');
    await vm.$children[0].getListAjax();
    expect(vm.$children[0].entries[0].name).to.equal("getajaxtest");

    Vue.http.interceptors.push((request, next) => {
      request.method = "POST";
      next(response => {
        response.status = 200;
        response.data = [{ name: "postajaxtest" }];
        response.ok = 200;
      });
    });

    vm = setup('url="/api/derp" requestType="post"');
    await vm.$children[0].getListAjax();
    expect(vm.$children[0].entries[0].name).to.equal("postajaxtest");
  });

  it("should autohide", () => {
    const vm = setup(
      ':autoHide="true" ref="autocomplete" :list="[{name: \'test\'}]"'
    );
    const component = vm.$refs.autocomplete;
    component.focused = true;
    component.mousefocus = true;
    component.search = "test";
    expect(component.focused).to.be.true;
    expect(component.mousefocus).to.be.true;
    component.select(0);
    expect(component.focused).to.be.false;
    expect(component.mousefocus).to.be.false;
  });

  it("should not autohide", () => {
    const vm = setup(
      ':autoHide="false" ref="autocomplete" :list="[{name: \'test\'}]"'
    );
    const component = vm.$refs.autocomplete;
    component.focused = true;
    component.mousefocus = true;
    component.search = "test";
    expect(component.focused).to.be.true;
    expect(component.mousefocus).to.be.true;
    component.select(0);
    expect(component.focused).to.be.true;
    expect(component.mousefocus).to.be.true;
  });
});

function setup(options) {
  return new Vue({
    template: "<autocomplete " + options + "></autocomplete>",
    components: {
      autocomplete: autocomplete
    }
  }).$mount();
}
