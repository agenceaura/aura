import 'package:flutter/material.dart';

/// A premium Navbar Item for Agence Aura with a Staggered Text Reveal effect.
/// On hover, letters slide up and are replaced by new ones from below.
class StaggeredNavItem extends StatefulWidget {
  final String text;
  final VoidCallback? onTap;

  const StaggeredNavItem({
    super.key,
    required this.text,
    this.onTap,
  });

  @override
  State<StaggeredNavItem> createState() => _StaggeredNavItemState();
}

class _StaggeredNavItemState extends State<StaggeredNavItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: widget.text.split('').asMap().entries.map((entry) {
              final int index = entry.key;
              final String char = entry.value;

              return _StaggeredLetter(
                char: char,
                isHovered: _isHovered,
                index: index,
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}

class _StaggeredLetter extends StatelessWidget {
  final String char;
  final bool isHovered;
  final int index;

  const _StaggeredLetter({
    required this.char,
    required this.isHovered,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    // Standardizing height for the reveal mask
    const double height = 24.0;
    
    return ClipRect(
      child: SizedBox(
        height: height,
        child: AnimatedPadding(
          // Staggered delay logic
          duration: const Duration(milliseconds: 800),
          curve: const Cubic(0.19, 1.0, 0.22, 1.0),
          padding: EdgeInsets.only(
            bottom: isHovered ? height : 0,
            top: isHovered ? 0 : height,
          ),
          // We wrap in a column to have "Original" and "Revealed" versions
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Top Letter (Original)
              SizedBox(
                height: height,
                child: Center(
                  child: Text(
                    char,
                    style: TextStyle(
                      color: isHovered ? Colors.white : const Color(0xFF999999),
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
              // Bottom Letter (Revealed)
              SizedBox(
                height: height,
                child: Center(
                  child: Text(
                    char,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                      fontFamily: 'Inter',
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The complete Navbar for Agence Aura
class AuraNavbar extends StatelessWidget {
  const AuraNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.2),
        border: Border(
           bottom: BorderSide(color: Colors.white.withOpacity(0.05)),
        ),
      ),
      child: ClipRRect(
        child: BackdropFilter(
          filter: ColorFilter.mode(Colors.black.withOpacity(0.5), BlendMode.darken),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'AURA.',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -1,
                ),
              ),
              Row(
                children: const [
                  StaggeredNavItem(text: 'trabajos'),
                  StaggeredNavItem(text: 'servicios'),
                  StaggeredNavItem(text: 'nosotros'),
                  StaggeredNavItem(text: 'blog'),
                  StaggeredNavItem(text: 'lab'),
                ],
              ),
              TextButton(
                onPressed: () {},
                child: const Text(
                  'Contact us',
                  style: TextStyle(color: Color(0xFF4D4DFF), fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
