describe('Reloading files', function() {
    context('CSS', function() {
        beforeEach(function() {
            cy.visit(Cypress.env('BS_URL'));
        });
        it('should reload single <link>', function() {
            cy.exec('touch test/fixtures/**/style.css');
            cy.get('[id="css-style"]').should($link => {
                const url = new URL($link.attr('href'));
                expect(url.search).to.contain('?browsersync=');
            });
        });
        it('should reload 2 css files', function() {
            cy.exec('touch test/fixtures/**/*.css');
            cy.get('link').should($links => {
                $links.each((i, elem) => {
                    const url = new URL(elem.href);
                    return expect(url.search).to.contain('?browsersync=');
                });
            });
        });
    });
    context('CSS IMPORTS', function() {
        it('can import 1 stylesheet from <style>@import</style>', () => {
            cy.visit(Cypress.env('BS_URL') + '/import.html');
            cy.document().then((doc) => {
                const firstStyle = doc.getElementsByTagName('style')[0];
                const href = firstStyle.sheet.cssRules[0].href;
                expect(href).to.not.contain('?browsersync=');
            });
            cy.exec('touch test/fixtures/assets/import.css');
            cy.get('style').eq(0).should((style) => {
                const href = style[0].sheet.cssRules[0].href;
                expect(href).to.contain('?browsersync=');
            });
        });
        it('can import nested from nested @import rules', () => {
            cy.visit(Cypress.env('BS_URL') + '/import-link.html');
            cy.document().then((doc) => {
                const href = doc.styleSheets[0].cssRules[0].href;
                expect(href).to.not.contain('?browsersync=');
            });
            cy.exec('touch test/fixtures/assets/import2.css');
            cy.get('link').eq(0).should((link) => {
                const href = link[0].sheet.cssRules[0].href;
                expect(href).to.contain('?browsersync=');
            })
        });
    });
    context('IMG', function() {
        beforeEach(function() {
            cy.visit(Cypress.env('BS_URL') + '/images.html');
        });
        it('should reload single <img src>', function() {
            cy.exec('touch test/fixtures/**/cam-secure.png');
            cy.get('[id="img-src-attr"]').should($link => {
                const url = new URL($link.attr('src'));
                expect(url.search).to.contain('?browsersync=');
            });
            cy.get('[id="img-style"]').should($link => {
                const urlFromStyle = $link.css('backgroundImage').split('"').slice(1, -1);
                const url = new URL(urlFromStyle);
                expect(url.search).not.to.contain('?browsersync=');
            });
        });
        it('should reload single style backgroundImage style property', function() {
            cy.exec('touch test/fixtures/**/cam-secure-02.png');
            cy.get('[id="img-src-attr"]').should($link => {
                expect($link.attr('src')).not.to.contain('?browsersync=');
            });
            cy.get('[id="img-style"]').should($link => {
                const urlFromStyle = $link.css('backgroundImage').split('"').slice(1, -1);
                const url = new URL(urlFromStyle);
                expect(url.search).to.contain('?browsersync=');
            });
        });
        it('should reload both images', function() {
            cy.exec('touch test/fixtures/**/*.png');
            cy.get('[id="img-src-attr"]').should($link => {
                const url = new URL($link.attr('src'));
                expect(url.search).to.contain('?browsersync=');
            });
            cy.get('[id="img-style"]').should($link => {
                const urlFromStyle = $link.css('backgroundImage').split('"').slice(1, -1);
                const url = new URL(urlFromStyle);
                expect(url.search).to.contain('?browsersync=');
            });
        });
    });
});
