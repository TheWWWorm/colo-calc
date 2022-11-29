import { AppComponent } from "./app.component";

// Not really a test, just a test of test
describe('AppComponent', () => {
  let component: AppComponent;
  beforeEach(() => {
    component = new AppComponent();
  });

  it('Inits', () => {
    expect(component).toBeTruthy();
  });
});